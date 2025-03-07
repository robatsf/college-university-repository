from django.contrib import admin
from files.models import FileSystem
from .base_admin import BaseModelAdmin
from django.db.models import Count

@admin.register(FileSystem)
class FilesytemAdmin(BaseModelAdmin):
    list_display = ('title', 'author', 'department', 'uploaded_by_type',)
    search_fields = ('title',)
    list_filter = ('department',)
    ordering = ('title',)
    
    def has_add_permission(self, request):
        """Disable adding new departments."""
        return False

    def has_change_permission(self, request, obj=None):
        """Allow updating departments."""
        return True

    def has_delete_permission(self, request, obj=None):
        """Allow deleting departments."""
        return True