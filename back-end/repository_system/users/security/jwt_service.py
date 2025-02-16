from datetime import datetime, timedelta
import jwt
from django.conf import settings
from rest_framework import exceptions, status
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from django.contrib.auth.hashers import check_password
from ..models import Student, Employee, Guest
from ..Reuse.ResponseStructure import ResponseStructure
from rest_framework import serializers

class JWTService:
    """Service for handling JWT token operations"""
    
    EMPLOYEE_DOMAINS = {
        "dcteacher.edu.et": "teacher",
        "dclibrarian.edu.et": "librarian",
        "dcdh.edu.et": "department_head"
    }
    
    STUDENT_DOMAIN = "dcstudents.edu.et"

    @staticmethod
    def get_user_by_email(email: str, password: str):
        """
        Validate user by email and password.
        Returns a tuple (user, user_type) on success.
        Raises AuthenticationFailed on errors.
        """
        domain = email.split('@')[-1]

        if domain in JWTService.EMPLOYEE_DOMAINS:
            model, user_type = Employee, "employee"
        elif domain == JWTService.STUDENT_DOMAIN:
            model, user_type = Student, "student"
        else:
            model, user_type = Guest, "guest"

        email_field = "institutional_email" if user_type != "guest" else "email"
        try:
            user = model.objects.get(**{email_field: email})
        except model.DoesNotExist:
            raise serializers.ValidationError({"email": "User not found"})

        if not check_password(password, user.password):
            raise serializers.ValidationError({"password": "Invalid Password credentials"})

        if user_type == "guest" and not user.is_verified:
            raise serializers.ValidationError({"email": "Email not verified"})
        if not user.is_active:
          raise serializers.ValidationError({"email": "Your Email Has been Deactive contact the adminstration!"})
    
        return user, user_type
    @staticmethod
    def Verify_user_by_email(email: str):
        """
        Validate user by email .
        Returns a tuple (user, user_type) on success.
        Raises AuthenticationFailed on errors.
        """
        domain = email.split('@')[-1]

        if domain in JWTService.EMPLOYEE_DOMAINS:
            model, user_type = Employee, "employee"
        elif domain == JWTService.STUDENT_DOMAIN:
            model, user_type = Student, "student"
        else:
            model, user_type = Guest, "guest"

        email_field = "institutional_email" if user_type != "guest" else "email"
        try:
            user = model.objects.get(**{email_field: email})
        except model.DoesNotExist:
            raise serializers.ValidationError({"message": "User not found"})

        if user_type == "guest" and not user.is_verified:
            raise serializers.ValidationError({"message": "Email not verified"})

        return user, user_type


    @staticmethod
    def generate_tokens(user, user_type: str):
        """
        Generate access and refresh tokens.
        Returns a DRF Response using ResponseStructure.
        """
        payload_data = {
            "user_id": str(user.id),
            "email": user.institutional_email if hasattr(user, "institutional_email") else user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "user_type": user_type,
            "exp": datetime.utcnow() + timedelta(minutes=60),  # Access token expires in 1 hour
            "iat": datetime.utcnow(),
            "token_type": "access"
        }

        if user_type == "student":
            payload_data.update({
                "role": "student",
                "year": getattr(user, "year", None),
                "department": getattr(user, "department", None)
            })
        elif user_type == "employee":
            payload_data.update({
                "role": getattr(user, "role", None),
                "department": getattr(user, "department", None)
            })
        else:  # guest
            payload_data.update({
                "role": "guest",
                "username": getattr(user, "username", None),
                "is_verified": user.is_verified
            })

        access_token = jwt.encode(payload_data, settings.SECRET_KEY, algorithm="HS256")
        refresh_token = jwt.encode({
            "user_id": str(user.id),
            "exp": datetime.utcnow() + timedelta(days=7),
            "token_type": "refresh"
        }, settings.SECRET_KEY, algorithm="HS256")

        return ResponseStructure.success(
            data={"access_token": access_token, "refresh_token": refresh_token},
            message="Tokens generated"
        )

    @staticmethod
    def refresh_access_token(refresh_token: str):
        """
        Generate a new access token using a refresh token.
        Returns a DRF Response using ResponseStructure.
        """
        try:
            payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=["HS256"])
            if payload.get("token_type") != "refresh":
                raise serializers.ValidationError({"message": "Invalid refresh token"})

            user_id = payload["user_id"]
            user = JWTService.get_user_by_id(user_id)
            # Determine user_type based on the instance type.
            if isinstance(user, Student):
                user_type = "student"
            elif isinstance(user, Employee):
                user_type = "employee"
            else:
                user_type = "guest"
            return JWTService.generate_tokens(user, user_type)

        except jwt.ExpiredSignatureError:
            raise serializers.ValidationError({"message": "Refresh token expired"})
        except jwt.InvalidTokenError:
            raise serializers.ValidationError({"message": "Invalid refresh token"})

    @staticmethod
    def verify_token(token: str):
        """
        Verify and decode a JWT token.
        Returns the payload dict on success.
        Raises AuthenticationFailed on errors.
        """
        try:
            return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise serializers.ValidationError({"message": " Token has xpired"})
        except jwt.InvalidTokenError:
            raise serializers.ValidationError({"message": "Invalid token"})

    @staticmethod
    def get_user_by_id(user_id: str):
        """
        Retrieve user object based on user ID.
        Raises AuthenticationFailed if not found.
        """
        for model in [Student, Employee, Guest]:
            try:
                return model.objects.get(id=user_id)
            except model.DoesNotExist:
                continue
        raise serializers.ValidationError({"message": "User not found"})


class JWTAuthentication(BaseAuthentication):
    """Custom authentication class for DRF"""

    def authenticate(self, request):
        auth_header = get_authorization_header(request).decode("utf-8")
        if not auth_header or "Bearer" not in auth_header:
            return None

        token = auth_header.split(" ")[1]
        try:
            payload = JWTService.verify_token(token)
            user = JWTService.get_user_by_id(payload["user_id"])
            return (user, token)
        except exceptions.AuthenticationFailed as e:
            raise e
