from django.contrib import admin
from Files.models import DepartmentList
from .base_admin import BaseModelAdmin

@admin.register(DepartmentList)
class DepartmentListAdmin(BaseModelAdmin):
    list_display = ('name', 'file_count', 'download_total', 'history_total', 'unapproved_files')
    search_fields = ('name',)
    ordering = ('name',)
    
    def has_add_permission(self, request):
        """Disable adding new departments."""
        return False

    def has_change_permission(self, request, obj=None):
        """Allow updating departments."""
        return True

    def has_delete_permission(self, request, obj=None):
        """Allow deleting departments."""
        return True
