from .base_user_serializer import BaseUserRegistrationSerializer
from ..models import Teacher
from rest_framework import serializers, status

class TeacherRegistrationSerializer(BaseUserRegistrationSerializer):
    class Meta:
        model = Teacher
        fields = ['first_name', 'middle_name', 'last_name', 'department', 
                  'email', 'profile_image']

    def create(self, validated_data):
        try:
            return self.create_user_with_credentials(validated_data, role="Teacher")
        except Exception as e:
            raise serializers.ValidationError(
                str(e),
                code=status.HTTP_400_BAD_REQUEST
            )
