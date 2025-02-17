from django.contrib import admin, messages
from django.urls import path, reverse
from django.utils.html import format_html
from django.shortcuts import redirect
from ..models import Teacher
from Authentication.service.services import UserUtils,EmailService
from django.contrib.auth.hashers import make_password
from Files.models import DepartmentList

# Mixins for common admin functionality
class ProfileImagePreviewMixin:
    def profile_image_preview(self, obj):
        if obj.profile_image:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius: 50%; object-fit: cover;" />',
                obj.profile_image.url
            )
        return format_html('<span style="color: red;">No Image</span>')
    profile_image_preview.short_description = "Profile Image"

class StatusIndicatorMixin:
    def status_indicator(self, obj):
        color = "#28a745" if obj.is_active else "#dc3545"
        status_text = "Active" if obj.is_active else "Inactive"
        return format_html(
            '<span style="color: {}; font-weight: bold; padding: 3px 8px; border-radius: 3px; background-color: {}20;">{}</span>',
            color, color, status_text
        )
    status_indicator.short_description = "Status"



@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin, ProfileImagePreviewMixin, StatusIndicatorMixin):
    list_display = (
        'first_name',
        'middle_name',
        'last_name',
        'profile_image_preview',
        'email',
        'institutional_email',
        'department_name',
        'status_indicator',
        'toggle_activation_button'
    )
    list_filter = ('is_active',)
    search_fields = ('first_name', 'last_name', 'email', 'institutional_email')
    ordering = ('-created_at',)
    readonly_fields = ('institutional_email',)
    fieldsets = (
        ('Personal Information', {
            'fields': ('first_name', 'middle_name', 'last_name', 'profile_image'),
        }),
        ('Teacher Details', {
            # Use the ForeignKey field so that the admin displays a select widget from DepartmentList.
            'fields': ('email', 'department_id')
        }),
    )

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                'toggle-teacher-activation/<uuid:teacher_id>/',
                self.admin_site.admin_view(self.toggle_activation),
                name='toggle_teacher_activation'
            ),
        ]
        return custom_urls + urls

    def toggle_activation(self, request, teacher_id, *args, **kwargs):
        try:
            teacher = Teacher.objects.get(id=teacher_id)
        except Teacher.DoesNotExist:
            self.message_user(request, "Teacher not found.", messages.ERROR)
            return redirect(request.META.get('HTTP_REFERER', 'admin:index'))
        teacher.is_active = not teacher.is_active
        teacher.save()
        status_msg = "activated" if teacher.is_active else "deactivated"
        self.message_user(
            request,
            f"Teacher '{teacher.first_name} {teacher.last_name}' has been {status_msg}.",
            messages.SUCCESS
        )
        return redirect(request.META.get('HTTP_REFERER', 'admin:index'))

    def toggle_activation_button(self, obj):
        action = "Deactivate" if obj.is_active else "Activate"
        url = reverse('admin:toggle_teacher_activation', args=[obj.id])
        button_class = "danger" if obj.is_active else "success"
        return format_html(
            '<a class="button btn-{}" href="{}" style="padding: 5px 10px; border-radius: 4px; text-decoration: none; background-color: {}; color: white;">{}</a>',
            button_class, url, "#dc3545" if obj.is_active else "#28a745", action
        )
    toggle_activation_button.short_description = "Activation"

    def role(self, obj):
        return "Teacher"
    role.short_description = "Role"

    def department_name(self, obj):
        """Display the name from the linked DepartmentList, or fallback to the text field."""
        if obj.department_id:
            return obj.department_id.name
        return obj.department
    department_name.short_description = "Department"

    def save_model(self, request, obj, form, change):
        """Generate institutional email and password for new teachers."""
        is_new = not change  # Check if it's a new entry

        if is_new:
            # Fetch existing department without creating a new one
            if obj.department and not obj.department_id:
                department = DepartmentList.objects.filter(name=obj.department).first()
                if department:
                    obj.department_id = department
                else:
                    self.message_user(request, f"Department '{obj.department}' does not exist.", messages.ERROR)
                    return

            obj.institutional_email = UserUtils.generate_institutional_email(
                obj.first_name, obj.last_name, "teacher"
            )
            
            plain_password = UserUtils.generate_password()
            obj.password = make_password(plain_password)

            super().save_model(request, obj, form, change)  # Save before sending email

            try:
                EmailService.send_credentials_email(
                    obj.first_name,
                    obj.email,
                    obj.institutional_email,
                    plain_password,
                    'Your Hudc institutional email as Teacher  has been created.'
                )
                self.message_user(request, f"Credentials sent to {obj.email}.", messages.SUCCESS)
            except Exception as e:
                self.message_user(request, f"Error sending email: {str(e)}", messages.ERROR)
        else:
            super().save_model(request, obj, form, change)

