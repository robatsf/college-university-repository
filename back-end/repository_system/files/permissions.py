# file_management/files/permissions.py
from rest_framework import permissions
from .models import PermissionSetting

class DynamicPermission(permissions.BasePermission):
    """
    Checks PermissionSetting for the current user's role and the HTTP method.
    """
    def has_permission(self, request, view):
        action = request.method
        if action == 'PATCH':
            action = 'PUT'
        # Get user role (if not authenticated, treat as guest)
        user_role = request.user.role if request.user.is_authenticated else 'guest'
        try:
            perm = PermissionSetting.objects.get(role=user_role, action=action)
            return perm.allowed
        except PermissionSetting.DoesNotExist:
            return False

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)
