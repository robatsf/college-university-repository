from rest_framework import serializers, status
from ..security.jwt_service import JWTService
from ..Reuse.ResponseStructure import ResponseStructure

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
            
            return ResponseStructure.success(
                data={
                    'user_type': user_type,
                    'tokens': tokens
                },
                message="Login successful",
                status_code=status.HTTP_200_OK
            )
        except Exception as e:
            return ResponseStructure.error(
                message="Login failed",
                errors=[str(e)],
                status_code=status.HTTP_400_BAD_REQUEST
            )
