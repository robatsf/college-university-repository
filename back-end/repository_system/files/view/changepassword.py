from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.contrib.auth import update_session_auth_hash

class ChangePasswordView(generics.GenericAPIView):
    """
    Endpoint for changing the password of a department head user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        new_password = request.data.get("new_password")
        if not new_password:
            raise ValidationError({"new_password": "This field is required."})
        
        old_password = request.data.get("old_password")
        if not old_password or not user.check_password(old_password):
            raise ValidationError({"old_password": "Old password is not correct."})
        
        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)  # Keeps the user authenticated

        return Response({"detail": "Password updated successfully."})
