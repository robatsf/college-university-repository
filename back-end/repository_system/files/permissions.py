from rest_framework import permissions
from .models import PermissionSetting
from django.contrib.contenttypes.models import ContentType

class DynamicPermission(permissions.BasePermission):
    """
    Checks PermissionSetting for the current user's role and the HTTP method.
    Handles department ID validation with fallback to POST/GET parameters.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_active:
            return False

        action = request.method
        if action == 'PATCH':
            action = 'PUT'

        user_role = self.get_user_role(request.user)

        try:
            perm = PermissionSetting.objects.get(role=user_role)
            allowed_actions = perm.actions
            allowed_filter_fields = perm.allowed_filter_fields
            request.user.allowed_filter_fields = allowed_filter_fields
            request.user.role = user_role 

            department_id = None
            
            if hasattr(request.user, 'department_id'):
                department_id = request.user.department_id.id
            elif request.POST.get('department_id'):
                department_id = request.POST.get('department_id')

                
            request.department_id = department_id
            return action in allowed_actions
            
        except PermissionSetting.DoesNotExist:
            return False

    def get_user_role(self, user):
        """
        Dynamically returns the role based on the table name (model).
        """
        user_type = ContentType.objects.get_for_model(user).model  # Get the table name

        # Map table names to roles
        role_mapping = {
            'departmenthead': 'department_head',
            'teacher': 'teacher',
            'student': 'student',
            'librarian': 'librarian'
        }

        return role_mapping.get(user_type, 'NonUser')

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)