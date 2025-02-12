# serializers/auth_serializers.py

from rest_framework import serializers
from ..jwt_service import JWTService

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user, user_type = JWTService.get_user_by_email(
                data['email'],
                data['password']
            )
            
            tokens = JWTService.generate_token(user, user_type)
            
            return {
                'user_type': user_type,
                'tokens': tokens
            }
        except Exception as e:
            raise serializers.ValidationError(str(e))