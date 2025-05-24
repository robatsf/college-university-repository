from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
import os
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from ..serializer.FileSystemSerializer import FileSystemSerializer
from .FileSystemViews import FileSystemViewSet
from ..models import DepartmentList

class FileListView(APIView):
    """
    Custom endpoint to list files.
    GET /files/list/
    """

    def get(self, request, *args, **kwargs):

        viewset = FileSystemViewSet()
        viewset.request = request
        queryset = viewset.get_queryset()
        serializer = FileSystemSerializer(queryset, many=True)
        total_count = queryset.count()

        data = serializer.data
        for item in data:
            if 'department' in item and item['department']:
                try:
                    department = DepartmentList.objects.get(id=item['department'])
                    item['department'] = department.name
                except DepartmentList.DoesNotExist:
                    pass
            
            if 'department_name' in item:
                item['department'] = item['department_name']
                del item['department_name']

        response = Response(data, status=status.HTTP_200_OK)
        response["Content-Range"] = f"files 0-{len(data)}/{total_count}"  # Add Content-Range header
        return response


class FileCreateView(APIView):
    """
    Custom endpoint to create a new file.
    POST /files/create/
    """


    def post(self, request, *args, **kwargs):
        viewset = FileSystemViewSet()
        viewset.request = request
        serializer = FileSystemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        viewset.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class FileUpdateView(APIView):
    """
    Custom endpoint to update an existing file.
    PUT /files/update/<uuid:pk>/
    """
    def put(self, request, pk, *args, **kwargs):
        viewset = FileSystemViewSet()
        viewset.request = request

        request.file_instance = get_object_or_404(viewset.get_queryset(), pk=pk) 
        serializer = FileSystemSerializer(request.file_instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        viewset.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FileDeleteView(APIView):
    """
    Custom endpoint to delete a file.
    DELETE /files/delete/<uuid:pk>/
    """

    def delete(self, request, pk, *args, **kwargs):
        viewset = FileSystemViewSet()
        viewset.request = request

        file_obj = get_object_or_404(viewset.get_queryset(), pk=pk)
        viewset.perform_destroy(file_obj)
        return Response(status=status.HTTP_204_NO_CONTENT)
