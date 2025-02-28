from rest_framework import serializers
from ..models import DepartmentList

class DepartmentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepartmentList
        fields = "__all__"  # Returns all fields in the model
