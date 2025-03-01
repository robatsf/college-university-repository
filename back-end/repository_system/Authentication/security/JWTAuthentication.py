from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.request import Request
import jwt
from django.conf import settings
from .jwt_service import JWTService

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request: Request):
        auth = request.headers.get('Authorization', None)
        if not auth:
            return None  # No authorization header, let IsAuthenticated handle this

        parts = auth.split()

        if len(parts) != 2:
            raise AuthenticationFailed('Authorization header must be in the format "Bearer <token>"')
        elif parts[0].lower() != 'bearer':
            raise AuthenticationFailed('Authorization header must start with Bearer')
        
        token = parts[1]
        try:
            # Verify and decode the token using the JWTService
            payload = JWTService.verify_token(token)
            user_id = payload.get('user_id')
            user = JWTService.get_user_by_id(user_id)

            return (user, token)  # Return the user and token for further processing
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')
        except Exception as e:
            raise AuthenticationFailed(f'Authentication failed: {str(e)}')

    def authenticate_header(self, request):
        return 'Bearer realm="api"'
