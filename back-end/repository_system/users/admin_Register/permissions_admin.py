# your_app/admin/permissions_admin.py

from django.contrib import admin
from .base_admin import BaseModelAdmin
from ..models import Permissions


# @admin.register(Permissions)
class PermissionsAdmin(BaseModelAdmin):
    list_display = ('role', 'permission_level', 'employees_id')
    list_filter = ('role', 'permission_level')
    search_fields = ('role', 'employees_id__email')