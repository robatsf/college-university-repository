from .base_user_serializer import BaseUserRegistrationSerializer
from ..models import DepartmentHead
from rest_framework import serializers, status

class DepartmentHeadRegistrationSerializer(BaseUserRegistrationSerializer):
    class Meta:
        model = DepartmentHead
        fields = ['first_name', 'middle_name', 'last_name', 'department', 
                  'email', 'profile_image']

    def create(self, validated_data):
        try:
            return self.create_user_with_credentials(validated_data, role="Department Head")
        except Exception as e:
            raise serializers.ValidationError(
                str(e),
                code=status.HTTP_400_BAD_REQUEST
            )
