# your_app/admin/guest_admin.py

from django.contrib import admin
from .base_admin import BaseModelAdmin
from ..models import Guest


@admin.register(Guest)
class GuestAdmin(BaseModelAdmin):
    list_display = ('username', 'email', 'is_verified', 'created_at')
    list_filter = ('is_verified', 'created_at')
    search_fields = ('username', 'email')
    ordering = ('-created_at',)