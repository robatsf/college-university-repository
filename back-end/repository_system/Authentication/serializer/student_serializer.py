from .base_user_serializer import BaseUserRegistrationSerializer
from ..models import Student
from rest_framework import serializers, status

class StudentRegistrationSerializer(BaseUserRegistrationSerializer):
    class Meta:
        model = Student
        fields = ['first_name', 'middle_name', 'last_name', 'department', 
                  'year', 'email', 'profile_image']

    def create(self, validated_data):
        try:
            return self.create_user_with_credentials(validated_data)
        except Exception as e:
            raise serializers.ValidationError(
                str(e),
                code=status.HTTP_400_BAD_REQUEST
            )
