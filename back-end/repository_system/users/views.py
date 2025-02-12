from rest_framework import generics, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
import random
import string
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from .models import Guest,Student, Employee
from .serializers import GuestRegistrationSerializer,StudentRegistrationSerializer, EmployeeRegistrationSerializer

class GuestRegistrationView(generics.CreateAPIView):
    queryset = Guest.objects.all()
    serializer_class = GuestRegistrationSerializer

class VerifyGuestView(generics.GenericAPIView):
    def get(self, request, token, *args, **kwargs):
        # Find the guest by token
        guest = get_object_or_404(Guest, email_verification_token=token)

        # Mark guest as verified
        guest.is_verified = True
        guest.email_verification_token = None  # Remove token after verification
        guest.save()

        return Response({"message": "Your email has been verified! You can now log in."}, status=status.HTTP_200_OK)


class StudentRegistrationView(generics.CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentRegistrationSerializer

    

class EmployeeRegistrationView(generics.CreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeRegistrationSerializer





class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = None

        # Check if the user is a student
        if Student.objects.filter(institutional_email=email).exists():
            user = Student.objects.get(institutional_email=email)
        # Check if the user is an employee
        elif Employee.objects.filter(institutional_email=email).exists():
            user = Employee.objects.get(institutional_email=email)

        if user and check_password(password, user.password):
            return Response({"message": "Login successful", "role": user.role if hasattr(user, "role") else "student"})
        return Response({"error": "Invalid email or password"}, status=400)

