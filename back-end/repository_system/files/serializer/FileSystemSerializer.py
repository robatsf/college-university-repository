# file_management/files/serializers.py
from rest_framework import serializers
from ..models import FileSystem, PermissionSetting
from ..models import DepartmentList

class FileSystemSerializer(serializers.ModelSerializer):
    department_name = serializers.SerializerMethodField()
    
    def get_department_name(self, obj):
        if obj.department:
            try:
                department = DepartmentList.objects.get(id=obj.department.id)
                return department.name
            except DepartmentList.DoesNotExist:
                return None
        return None
    
    class Meta:
        model = FileSystem
        fields = '__all__'

class PermissionSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermissionSetting
        fields = '__all__'
