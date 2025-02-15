from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from users.models import Student, Employee
from rest_framework.permissions import AllowAny
from ..serializer.Login_serializers import LoginSerializer

class LoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data.get("email")
        password = serializer.validated_data.get("password")
        user = None
        role = "student"

        # Check if user is a Student
        if Student.objects.filter(institutional_email=email).exists():
            user = Student.objects.get(institutional_email=email)

            # Block inactive students
            if not user.is_active:
                return Response(
                    {"error": "Your account has been deactivated. Please contact the administrator."},
                    status=status.HTTP_403_FORBIDDEN
                )

        # Check if user is an Employee
        elif Employee.objects.filter(institutional_email=email).exists():
            user = Employee.objects.get(institutional_email=email)
            role = getattr(user, "role", "employee")

            # Block inactive employees
            if not user.is_active:
                return Response(
                    {"error": "Your account has been deactivated. Please contact the administrator."},
                    status=status.HTTP_403_FORBIDDEN
                )

        # Verify the password
        if user and check_password(password, user.password):
            return Response(
                {
                    "message": "Login successful",
                    "role": role,
                    "email": user.institutional_email,
                },
                status=status.HTTP_200_OK,
            )

        return Response({"error": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)
