from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.hashers import check_password, make_password
from Authentication.security.JWTAuthentication import JWTAuthentication

class ChangePasswordView(generics.GenericAPIView):
    """
    Endpoint for changing the password of any authenticated user.
    Handles different user models that may not inherit from Django's AbstractUser.
    """
    authentication_classes = [JWTAuthentication]  # Use JWTAuthentication for authentication
    permission_classes = []
    def post(self, request, *args, **kwargs):
        user = request.user
        new_password = request.data.get("new_password")
        if not new_password:
            raise ValidationError({"new_password": "This field is required."})
        
        old_password = request.data.get("old_password")
        if not old_password:
            raise ValidationError({"old_password": "This field is required."})

        if hasattr(user, 'check_password') and callable(user.check_password):
            password_valid = user.check_password(old_password)
        elif hasattr(user, 'password'):
            password_valid = check_password(old_password, user.password)
        else:
            raise ValidationError({"error": "Cannot verify password for this user type."})
        
        if not password_valid:
            raise ValidationError({"old_password": "Old password is not correct."})
        
        if hasattr(user, 'set_password') and callable(user.set_password):
            user.set_password(new_password)
        elif hasattr(user, 'password'):
            user.password = make_password(new_password)
        else:
            raise ValidationError({"error": "Cannot change password for this user type."})
        
        user.save()

        return Response({"detail": "Password updated successfully."})