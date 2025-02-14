from datetime import datetime, timedelta
from typing import Dict, Tuple
import jwt
from django.conf import settings
from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from django.contrib.auth.hashers import check_password
from ..models import Student, Employee, Guest

class JWTService:
    """Service for handling JWT token operations"""
    
    EMPLOYEE_DOMAINS = {
        "dcteacher.edu.et": "teacher",
        "dclibrarian.edu.et": "librarian",
        "dcdh.edu.et": "department_head"
    }
    
    STUDENT_DOMAIN = "dcstudents.edu.et"

    @staticmethod
    def get_user_by_email(email: str, password: str) -> Tuple[object, str]:
        """Get user by email and validate password"""
        domain = email.split('@')[-1]

        if domain in JWTService.EMPLOYEE_DOMAINS:
            model, user_type = Employee, "employee"
        elif domain == JWTService.STUDENT_DOMAIN:
            model, user_type = Student, "student"
        else:
            model, user_type = Guest, "guest"

        try:
            user = model.objects.get(institutional_email=email if user_type != "guest" else "email")
            if not check_password(password, user.password):
                raise exceptions.AuthenticationFailed("Invalid credentials")
            if user_type == "guest" and not user.is_verified:
                raise exceptions.AuthenticationFailed("Email not verified")
            return user, user_type
        except model.DoesNotExist:
            raise exceptions.AuthenticationFailed("User not found")

    @staticmethod
    def generate_tokens(user, user_type: str) -> Dict[str, str]:
        """Generate access and refresh tokens"""

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

        # Additional role-based data
        if user_type == "student":
            payload_data.update({"role": "student", "year": user.year, "department": user.department})
        elif user_type == "employee":
            payload_data.update({"role": user.role, "department": user.department})
        else:  # guest
            payload_data.update({"role": "guest", "username": user.username, "is_verified": user.is_verified})

        # Generate tokens
        access_token = jwt.encode(payload_data, settings.SECRET_KEY, algorithm="HS256")
        refresh_token = jwt.encode(
            {"user_id": str(user.id), "exp": datetime.utcnow() + timedelta(days=7), "token_type": "refresh"},
            settings.SECRET_KEY, algorithm="HS256"
        )

        return {"access_token": access_token, "refresh_token": refresh_token}

    @staticmethod
    def refresh_access_token(refresh_token: str) -> str:
        """Generate new access token using a refresh token"""
        try:
            payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=["HS256"])
            if payload["token_type"] != "refresh":
                raise exceptions.AuthenticationFailed("Invalid refresh token")

            user_id = payload["user_id"]
            user = JWTService.get_user_by_id(user_id)
            return JWTService.generate_tokens(user, user.user_type)["access_token"]

        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Refresh token expired")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Invalid refresh token")

    @staticmethod
    def verify_token(token: str) -> Dict:
        """Verify and decode a JWT token"""
        try:
            return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token has expired")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Invalid token")

    @staticmethod
    def get_user_by_id(user_id: str):
        """Retrieve user object based on user ID"""
        for model in [Student, Employee, Guest]:
            try:
                return model.objects.get(id=user_id)
            except model.DoesNotExist:
                continue
        raise exceptions.AuthenticationFailed("User not found")

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
            return user, token
        except exceptions.AuthenticationFailed as e:
            raise e
