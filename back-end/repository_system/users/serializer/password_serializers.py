# serializers/password_serializers.py

from rest_framework import serializers
from ..service.password_service import PasswordService

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def save(self):
        email = self.validated_data['email']
        return PasswordService.reset_password(email)


        