from datetime import datetime, timedelta
import jwt
from django.conf import settings
from rest_framework import serializers, exceptions
from django.contrib.auth.hashers import check_password
from ..models import Student, Guest, Teacher, Librarian, DepartmentHead
from ..Reuse.ResponseStructure import ResponseStructure

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

        if domain == JWTService.STUDENT_DOMAIN:
            model, user_type = Student, "student"
        elif domain in JWTService.EMPLOYEE_DOMAINS:
            role = JWTService.EMPLOYEE_DOMAINS[domain]
            model = {
                "teacher": Teacher,
                "librarian": Librarian,
                "department_head": DepartmentHead
            }.get(role, None)

            if not model:
                raise serializers.ValidationError({"email": "Invalid domain"})
            
            user_type = role
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
            raise serializers.ValidationError({"email": "Your Email has been deactivated, contact administration!"})

        return user, user_type

    @staticmethod
    def verify_user_by_email(email: str):
        """
        Validate user by email.
        Returns a tuple (user, user_type) on success.
        Raises AuthenticationFailed on errors.
        """
        domain = email.split('@')[-1]

        if domain == JWTService.STUDENT_DOMAIN:
            model, user_type = Student, "student"
        elif domain in JWTService.EMPLOYEE_DOMAINS:
            role = JWTService.EMPLOYEE_DOMAINS[domain]
            model = {
                "teacher": Teacher,
                "librarian": Librarian,
                "department_head": DepartmentHead
            }.get(role, None)

            if not model:
                raise serializers.ValidationError({"email": "Invalid domain"})
            
            user_type = role
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
            "exp": datetime.utcnow() + timedelta(minutes=60),
            "iat": datetime.utcnow(),
            "token_type": "access"
        }

        if user_type == "student":
            payload_data.update({
                "role": "student",
                "year": getattr(user, "year", None),
                "department": getattr(user, "department", None)
            })
        elif user_type in ["teacher", "librarian", "department_head"]:
            payload_data.update({
                "role": user_type,
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
            
            user_type = None
            if isinstance(user, Student):
                user_type = "student"
            elif isinstance(user, Teacher):
                user_type = "teacher"
            elif isinstance(user, Librarian):
                user_type = "librarian"
            elif isinstance(user, DepartmentHead):
                user_type = "department_head"
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
            raise serializers.ValidationError({"message": "Token has expired"})
        except jwt.InvalidTokenError:
            raise serializers.ValidationError({"message": "Invalid token"})

    @staticmethod
    def get_user_by_id(user_id: str):
        """
        Retrieve user object based on user ID.
        Raises AuthenticationFailed if not found.
        """
        for model in [Student, Teacher, Librarian, DepartmentHead, Guest]:
            try:
                return model.objects.get(id=user_id)
            except model.DoesNotExist:
                continue
        raise serializers.ValidationError({"message": "User not found"})
