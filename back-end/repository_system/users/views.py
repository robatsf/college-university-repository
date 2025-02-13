from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import check_password
from .models import Guest, Student, Employee
from .serializers import (
    GuestRegistrationSerializer,
    StudentRegistrationSerializer, 
    EmployeeRegistrationSerializer
)

class ResponseStructure:
    @staticmethod
    def success(data=None, message="Success", status_code=status.HTTP_200_OK):
        response = {
            "success": True,
            "data": data,
            "errors": [],
            "message": message
        }
        return Response(response, status=status_code)

    @staticmethod
    def error(message="Error", errors=None, status_code=status.HTTP_400_BAD_REQUEST):
        if not errors:
            errors = [message]
        elif isinstance(errors, str):
            errors = [errors]
            
        response = {
            "success": False,
            "data": None,
            "errors": errors,
            "message": message
        }
        return Response(response, status=status_code)

class GuestRegistrationView(generics.CreateAPIView):
    queryset = Guest.objects.all()
    serializer_class = GuestRegistrationSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            result = serializer.save()
            return ResponseStructure.success(
                data=result.get('data'),
                message=result.get('message', "Registration successful. Please check your email for verification."),
                status_code=status.HTTP_201_CREATED
            )
        except Exception as e:
            return ResponseStructure.error(
                message="Registration failed",
                errors=str(e),
                status_code=status.HTTP_400_BAD_REQUEST
            )

class VerifyGuestView(generics.GenericAPIView):
    def get(self, request, token, *args, **kwargs):
        try:
            guest = get_object_or_404(Guest, email_verification_token=token)
            
            if guest.is_verified:
                return ResponseStructure.error(
                    message="Email already verified",
                    errors=["This email has already been verified"],
                    status_code=status.HTTP_400_BAD_REQUEST
                )

            guest.is_verified = True
            guest.email_verification_token = None
            guest.save()

            return ResponseStructure.success(
                data={"email": guest.email},
                message="Email verification successful. You can now log in.",
                status_code=status.HTTP_200_OK
            )
        except Exception as e:
            return ResponseStructure.error(
                message="Verification failed",
                errors=[str(e)],
                status_code=status.HTTP_400_BAD_REQUEST
            )

class StudentRegistrationView(generics.CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentRegistrationSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            result = serializer.save()
            return ResponseStructure.success(
                data=result.get('data'),
                message=result.get('message', "Student registration successful. Credentials sent to email."),
                status_code=status.HTTP_201_CREATED
            )
        except Exception as e:
            return ResponseStructure.error(
                message="Registration failed",
                errors=[str(e)],
                status_code=status.HTTP_400_BAD_REQUEST
            )

class EmployeeRegistrationView(generics.CreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeRegistrationSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            result = serializer.save()
            return ResponseStructure.success(
                data=result.get('data'),
                message=result.get('message', "Employee registration successful. Credentials sent to email."),
                status_code=status.HTTP_201_CREATED
            )
        except Exception as e:
            return ResponseStructure.error(
                message="Registration failed",
                errors=[str(e)],
                status_code=status.HTTP_400_BAD_REQUEST
            )