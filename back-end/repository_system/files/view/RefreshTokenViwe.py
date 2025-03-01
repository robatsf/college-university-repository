# views.py
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from Authentication.security.jwt_service import JWTService
from rest_framework.decorators import permission_classes, api_view
from rest_framework.exceptions import ValidationError
from Authentication.Reuse.ResponseStructure import ResponseStructure

@permission_classes([AllowAny])
class TokenRefreshView(APIView):
    """
    Public API View to refresh access tokens using a refresh token.
    No authentication required.
    """
    permission_classes = [AllowAny]  # Make the endpoint public

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get('refresh_token')
            
            if not refresh_token:
                return ResponseStructure.error(
                    message="Refresh token is required",
                    status_code=status.HTTP_400_BAD_REQUEST
                )

            response = JWTService.refresh_access_token(refresh_token)
            return response

        except ValidationError as e:
            return ResponseStructure.error(
                message=str(e.detail.get('message', 'Token refresh failed')),
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return ResponseStructure.error(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )