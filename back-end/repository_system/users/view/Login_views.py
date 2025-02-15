# views/auth_views.py

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from ..serializer.Login_serializers import LoginSerializer
from ..Reuse.ResponseStructure import ResponseStructure   

class LoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return ResponseStructure.success(
            data=serializer.validated_data,
            message="Login successful",
            status_code=status.HTTP_200_OK
        )
