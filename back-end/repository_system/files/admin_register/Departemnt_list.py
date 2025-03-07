from django.contrib import admin
from files.models import DepartmentList, FileSystem
from .base_admin import BaseModelAdmin
from django.db.models import Count, Q

@admin.register(DepartmentList)
class DepartmentListAdmin(BaseModelAdmin):
    list_display = ('name', 'file_count', 'download_total', 'get_unapproved_files')
    search_fields = ('name',)
    ordering = ('name',)
    
    def get_unapproved_files(self, obj):
        """
        Calculate and return the count of unapproved files for this department.
        """
        return FileSystem.objects.filter(
            department=obj,
            approved="unapproved",
            disapproval_reason=None
        ).count()
    
    get_unapproved_files.short_description = 'Unapproved Files'
    get_unapproved_files.admin_order_field = 'unapproved_files'
    
    def has_add_permission(self, request):
        """Disable adding new departments."""
        return False

    def has_change_permission(self, request, obj=None):
        """Allow updating departments."""
        return True

    def has_delete_permission(self, request, obj=None):
        """Allow deleting departments."""
        return True