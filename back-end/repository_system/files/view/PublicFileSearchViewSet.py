from django.utils import timezone
from django.db.models import Q
from django.db.models.functions import Lower, ExtractYear
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters import rest_framework as django_filters
from rest_framework.pagination import PageNumberPagination

from ..models import FileSystem, SearchManager
from ..serializer.PopularSearchSerialzer import (
    SearchQuerySerializer,
    PopularSearchSerializer
)
from ..serializer.FileSystemSerializer import FileSystemSerializer
from django.db.models import Count, Max

class CustomPagination(PageNumberPagination):
    page_size = 7
    page_size_query_param = 'page_size'
    max_page_size = 100

class PublicFileSearchViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FileSystem.objects.filter(
        approved='approved',
        availability=True
    )
    
    serializer_class = FileSystemSerializer
    pagination_class = CustomPagination
    filter_backends = [django_filters.DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['title', 'created_at', 'year']
    ordering = ['-created_at']
    authentication_classes = []
    permission_classes = [AllowAny]

    def serialize_data(self, data):
        if isinstance(data, list):
            return [{k: v for k, v in item.items() 
                    if k not in ['approved', 'original_file_path', 'uploaded_by', 'disapproval_reason', 'department','uploaded_by_type','uploaded_by_id']}
                   for item in data]
        return {k: v for k, v in data.items() 
                if k not in ['approved', 'original_file_path', 'uploaded_by', 'disapproval_reason', 'department','uploaded_by_type','uploaded_by_id']}

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def get_search_results(self, query, queryset):
        if not query:
            return queryset
                
        return queryset.annotate(
            lower_title=Lower('title'),
            lower_description=Lower('description'),
            lower_author=Lower('author'),
        ).filter(
            Q(lower_title__contains=query.lower()) |
            Q(lower_description__contains=query.lower()) |
            Q(lower_author__contains=query.lower()) |
            Q(department__name__icontains=query)
        )

    def apply_filters(self, queryset, request):
        file_type = request.query_params.get('file_type')
        if file_type:
            queryset = queryset.filter(file_extension__iexact=file_type)

        title = request.query_params.get('title')
        if title:
            queryset = queryset.filter(title__icontains=title)

        year = request.query_params.get('year')
        if year:
            try:
                year = int(year)
                queryset = queryset.filter(created_at__year=year)
            except (ValueError, TypeError):
                pass

        department = request.query_params.get('department')
        if department:
            queryset = queryset.filter(department__name__icontains=department)

        author = request.query_params.get('author')
        if author:
            queryset = queryset.filter(author__icontains=author)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        queryset = self.apply_filters(queryset, request)
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data = self.serialize_data(serializer.data)
            for item in data:
                item['department'] = queryset.get(id=item['id']).department.name
            return self.get_paginated_response(data)

        serializer = self.get_serializer(queryset, many=True)
        data = self.serialize_data(serializer.data)
        for item in data:
            item['department'] = queryset.get(id=item['id']).department.name
        return Response(data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = self.serialize_data(serializer.data)
        data['department'] = instance.department.name
        return Response(data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '').strip()
        queryset = self.get_queryset()
        similar_queries = []
        
        if query:
            similar_queries = SearchManager.get_similar_searches(query)
            queryset = self.get_search_results(query, queryset)
            
            if not queryset.exists() and similar_queries.exists():
                for similar_query in similar_queries:
                    similar_results = self.get_search_results(similar_query.query, self.get_queryset())
                    if similar_results.exists():
                        queryset = similar_results
                        break

        queryset = self.apply_filters(queryset, request)

        file_types = queryset.values('file_extension').distinct()
        context = {
            'query': query,
            'popular_searches': PopularSearchSerializer(
                SearchManager.get_popular_searches(),
                many=True
            ).data,
            'recent_searches': SearchQuerySerializer(
                SearchManager.get_recent_searches(),
                many=True
            ).data,
            'similar_searches': PopularSearchSerializer(
                similar_queries,
                many=True
            ).data if query else [],
            'has_similar_results': bool(similar_queries and not queryset.exists()),
            'available_filters': {
                'file_types': [ft['file_extension'] for ft in file_types if ft['file_extension']],
                'years': sorted(list(set(queryset.annotate(
                    year=ExtractYear('created_at')
                ).values_list('year', flat=True)))),
                'titles': sorted(list(set(queryset.values_list('title', flat=True))))[:10],
                'departments': sorted(list(set(queryset.values_list('department__name', flat=True))))
            }
        }

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data = self.serialize_data(serializer.data)
            for item in data:
                item['department'] = queryset.get(id=item['id']).department.name

            if len(data) > 0 and  query:
                SearchManager.record_search(
                    query=query,
                    ip_address=self.get_client_ip(request)
                )
            
            return self.get_paginated_response({
                'results': data,
                'search_context': context
            })

        serializer = self.get_serializer(queryset, many=True)
        data = self.serialize_data(serializer.data)
        for item in data:
            item['department'] = queryset.get(id=item['id']).department.name
        
        if data['results'] is not  [] :
            SearchManager.record_search(
                query=query,
                ip_address=self.get_client_ip(request)
            )
        
        return Response({
            'results': data,
            'search_context': context
        })

    @action(detail=False, methods=['get'])
    def popular(self, request):
        popular_searches = SearchManager.get_popular_searches()[:5]
        serializer = PopularSearchSerializer(popular_searches, many=True)
        return Response({
            'results': serializer.data,
            'count': len(serializer.data)
        })

    @action(detail=False, methods=['get'])
    def recent(self, request):
        recent_searches = SearchManager.get_recent_searches()
        serializer = SearchQuerySerializer(recent_searches, many=True)
        return Response({
            'results': serializer.data,
            'count': len(serializer.data)
        })
    @action(detail=False, methods=['get'])
    def filters(self, request):
        queryset = self.get_queryset()
        
        years = queryset.annotate(
            year=ExtractYear('created_at')
        ).values('year').distinct().order_by('-year')
        
        titles = queryset.values(
            'id', 
            'title',
            'created_at',
            'file_extension',
            'department__name'
        ).order_by('title')[:10]
        
        authors = queryset.values('author').annotate(
            count=Count('id'),
            latest_submission=Max('created_at')
        ).exclude(
            author__isnull=True
        ).exclude(
            author__exact=''
        ).order_by('-count')[:10]
        
        departments = queryset.values(
            'department__name'
        ).annotate(
            count=Count('id'),
            latest_file=Max('created_at')
        ).exclude(
            department__name__isnull=True
        ).order_by('-count')
        
        file_types = queryset.values(
            'file_extension'
        ).annotate(
            count=Count('id')
        ).exclude(
            file_extension__isnull=True
        ).exclude(
            file_extension__exact=''
        ).order_by('-count')
        
        return Response({
            'file_types': [{
                'extension': item['file_extension'],
                'count': item['count']
            } for item in file_types],
            
            'years': [{
                'year': item['year'],
                'count': queryset.filter(created_at__year=item['year']).count()
            } for item in years],
            
            'titles': [{
                'id': item['id'],
                'title': item['title'],
                'year': item['created_at'].year,
                'file_type': item['file_extension'],
                'department': item['department__name']
            } for item in titles],
            
            'authors': [{
                'name': item['author'],
                'count': item['count'],
                'latest_submission': item['latest_submission']
            } for item in authors],
            
            'departments': [{
                'name': item['department__name'],
                'count': item['count'],
                'latest_file': item['latest_file']
            } for item in departments]
        })