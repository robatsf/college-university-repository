# serializer/PopularSearchSerializer.py

from rest_framework import serializers
from ..models import SearchQuery, PopularSearch

class SearchQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchQuery
        fields = ['query', 'created_at']
        read_only_fields = ['created_at']

class PopularSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = PopularSearch
        fields = ['query', 'count', 'last_searched']
        read_only_fields = ['count', 'last_searched']