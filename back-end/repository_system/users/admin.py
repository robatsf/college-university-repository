from django.contrib import admin
from django.db.models import Count
from django.utils.html import format_html
from django.urls import path
from django.db.models.functions import TruncMonth
from django.db.models import Sum
from django.shortcuts import render
from django.contrib.admin import SimpleListFilter
import json
from datetime import datetime, timedelta
from .models import (
    Student, Employee, Guest, Request, FileSystem, 
     Permissions, Download
)
from .utils import UserUtils, EmailService
from django.contrib import messages
from django.contrib.auth.hashers import make_password

# Custom Filters
class DepartmentFilter(SimpleListFilter):
    title = 'Department'
    parameter_name = 'department'

    def lookups(self, request, model_admin):
        departments = model_admin.model.objects.values_list('department', flat=True).distinct()
        return [(dept, dept) for dept in departments]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(department=self.value())
        return queryset

# Base Admin Class with common functionality
class BaseModelAdmin(admin.ModelAdmin):
    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return self.readonly_fields + ('created_at', 'updated_time')
        return self.readonly_fields

    def get_list_filter(self, request):
        return self.list_filter + ('created_at',)

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'department','profile_image_preview', 'year', 'email', 'institutional_email', 'status_indicator')
    list_filter = ('year', 'department')
    search_fields = ('first_name', 'last_name', 'email', 'institutional_email')
    ordering = ('-created_at',)
    
    def profile_image_preview(self, obj):
        if obj.profile_image:
            return format_html('<img src="{}" width="50" height="50"/>'.format(obj.profile_image.url))
        return "No Image"

    profile_image_preview.short_description = "Profile Image"

    fieldsets = (
        ('Personal Information', {
            'fields': ('first_name', 'middle_name', 'last_name', 'profile_image')
        }),
        ('Academic Information', {
            'fields': ('department', 'year', 'email')
        }),
    )

    def status_indicator(self, obj):
        if obj.ask_for_forget_password:
            return format_html('<span style="color: red;">⚠️ Password Reset Requested</span>')
        return format_html('<span style="color: green;">✓ Active</span>')
    
    status_indicator.short_description = 'Status'

    def save_model(self, request, obj, form, change):
        """
        Override save_model to generate institutional email, password, and send credentials.
        """
        if not obj.institutional_email:
            obj.institutional_email = UserUtils.generate_institutional_email(obj.first_name, obj.last_name, "student")

        plain_password = UserUtils.generate_password()
        obj.password = make_password(plain_password)  # Hash the password before saving

        super().save_model(request, obj, form, change)  # Save the student instance

        # Send email with credentials
        try:
            EmailService.send_credentials_email(obj.first_name, obj.email, obj.institutional_email, plain_password)
            self.message_user(request, f"Credentials sent to {obj.email}.", messages.SUCCESS)
        except Exception as e:
            self.message_user(request, f"Error sending email: {str(e)}", messages.ERROR)

# admin.site.register(Student, StudentAdmin)

def status_indicator(self, obj):
        if obj.ask_for_forget_password:
            return format_html('<span style="color: red;">⚠️ Password Reset Requested</span>')
        return format_html('<span style="color: green;">✓ Active</span>')
        status_indicator.short_description = 'Status'

@admin.register(Employee)
class EmployeeAdmin(BaseModelAdmin):
    list_display = ('first_name', 'last_name', 'department', 'role', 'email')
    list_filter = (DepartmentFilter, 'role')
    search_fields = ('first_name', 'last_name', 'email')
    ordering = ('-created_at',)

# @admin.register(FileSystem)
# class FileSystemAdmin(BaseModelAdmin):
#     list_display = ('title', 'author', 'type', 'availability', 'created_at')
#     list_filter = ('type', 'availability')
#     search_fields = ('title', 'author')
#     ordering = ('-created_at',)

#     def get_urls(self):
#         urls = super().get_urls()
#         custom_urls = [
#             path('file-statistics/', self.admin_site.admin_view(self.file_statistics_view),
#                  name='file-statistics'),
#         ]
#         return custom_urls + urls

#     def file_statistics_view(self, request):
#         # Get file statistics
#         total_files = FileSystem.objects.count()
#         files_by_type = FileSystem.objects.values('type').annotate(count=Count('id'))
#         available_files = FileSystem.objects.filter(availability=True).count()

#         # Prepare data for charts
#         context = {
#             'total_files': total_files,
#             'available_files': available_files,
#             'files_by_type': json.dumps(list(files_by_type)),
#         }
#         return render(request, 'admin/file_statistics.html', context)

@admin.register(Request)
class RequestAdmin(BaseModelAdmin):
    list_display = ('user_request_id', 'requested_file_id', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user_request_id', 'requested_file_id')
    ordering = ('-created_at',)


# @admin.register(Download)
# class DownloadAdmin(BaseModelAdmin):
#     list_display = ('user_id', 'file_id', 'download_date')
#     list_filter = ('download_date',)
#     search_fields = ('user_id', 'file_id__title')
#     ordering = ('-download_date',)

#     def get_urls(self):
#         urls = super().get_urls()
#         custom_urls = [
#             path('download-statistics/', 
#                  self.admin_site.admin_view(self.download_statistics_view),
#                  name='download-statistics'),
#         ]
#         return custom_urls + urls

#     def download_statistics_view(self, request):
#         # Get download statistics for the last 30 days
#         thirty_days_ago = datetime.now() - timedelta(days=30)
#         downloads_by_day = Download.objects.filter(
#             download_date__gte=thirty_days_ago
#         ).annotate(
#             date=TruncMonth('download_date')
#         ).values('date').annotate(
#             count=Count('id')
#         ).order_by('date')

#         context = {
#             'total_downloads': Download.objects.count(),
#             'downloads_by_day': json.dumps(list(downloads_by_day)),
#         }
#         return render(request, 'admin/download_statistics.html', context)

@admin.register(Guest)
class GuestAdmin(BaseModelAdmin):
    list_display = ('username', 'email', 'is_verified', 'created_at')
    list_filter = ('is_verified', 'created_at')
    search_fields = ('username', 'email')
    ordering = ('-created_at',)

@admin.register(Permissions)
class PermissionsAdmin(BaseModelAdmin):
    list_display = ('role', 'permission_level', 'employees_id')
    list_filter = ('role', 'permission_level')
    search_fields = ('role', 'employees_id__email')
