# your_app/admin/request_admin.py

from django.contrib import admin
from .base_admin import BaseModelAdmin
from ..models import Request


# @admin.register(Request)
class RequestAdmin(BaseModelAdmin):
    list_display = ('user_request_id', 'requested_file_id', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user_request_id', 'requested_file_id')
    ordering = ('-created_at',)