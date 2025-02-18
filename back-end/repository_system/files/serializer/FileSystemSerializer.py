# file_management/files/serializers.py
from rest_framework import serializers
from ..models import FileSystem, PermissionSetting

class FileSystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileSystem
        fields = '__all__'

class PermissionSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermissionSetting
        fields = '__all__'
