from rest_framework import serializers, status
from ..security.jwt_service import JWTService

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user, user_type = JWTService.get_user_by_email(
                data['email'],
                data['password']
            )

            tokens_response = JWTService.generate_tokens(user, user_type)
            tokens = tokens_response.data.get("data", {})
            return {
                'user_type': user_type,
                'tokens': tokens
            }
        except Exception as e:
            raise serializers.ValidationError({"errors": e.args,"message" : "Login Failed"})
