from django.contrib import admin
from django.utils.html import format_html
from django.urls import path, reverse
from django.contrib import messages
from ..models import Librarian
from django.shortcuts import redirect

class ProfileImagePreviewMixin:
    """Mixin to display profile image preview in admin panel."""
    def profile_image_preview(self, obj):
        if obj.profile_image:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius: 50%; object-fit: cover;" />',
                obj.profile_image.url
            )
        return format_html('<span style="color: red;">No Image</span>')

    profile_image_preview.short_description = "Profile Image"

class StatusIndicatorMixin:
    """Mixin to show status indicator in admin panel."""
    def status_indicator(self, obj):
        color = "#28a745" if obj.is_active else "#dc3545"
        status_text = "Active" if obj.is_active else "Inactive"
        return format_html(
            '<span style="color: {}; font-weight: bold; padding: 3px 8px; '
            'border-radius: 3px; background-color: {}20;">{}</span>',
            color, color, status_text
        )

    status_indicator.short_description = "Status"



@admin.register(Librarian)
class LibrarianAdmin(admin.ModelAdmin, ProfileImagePreviewMixin, StatusIndicatorMixin):
    list_display = ('first_name', 'middle_name', 'last_name', 'profile_image_preview', 
                    'email', 'institutional_email', 'status_indicator', 'toggle_activation_button')
    list_filter = ('is_active',)
    search_fields = ('first_name', 'last_name', 'email', 'institutional_email')
    ordering = ('-created_at',)
    readonly_fields = ('institutional_email',)

    fieldsets = (
        ('Personal Information', {
            'fields': ('first_name', 'middle_name', 'last_name', 'profile_image'),
        }),
        ('Librarian Details', {
            'fields': ('email',)
        }),
    )

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                'toggle-employee-activation/<uuid:employee_id>/',
                self.admin_site.admin_view(self.toggle_employee_activation),
                name='toggle_employee_activation'
            ),
        ]
        return custom_urls + urls

    def toggle_employee_activation(self, request, employee_id, *args, **kwargs):
        try:
            employee = Librarian.objects.get(id=employee_id)
        except Librarian.DoesNotExist:
            self.message_user(request, "Employee not found.", messages.ERROR)
            return redirect(request.META.get('HTTP_REFERER', 'admin:index'))

        employee.is_active = not employee.is_active
        employee.save()
        status = "activated" if employee.is_active else "deactivated"
        self.message_user(
            request,
            f"Employee '{employee.first_name} {employee.last_name}' has been {status}.",
            messages.SUCCESS
        )
        return redirect(request.META.get('HTTP_REFERER', 'admin:index'))

    def toggle_activation_button(self, obj):
        action = "Deactivate" if obj.is_active else "Activate"
        url = reverse('admin:toggle_employee_activation', args=[obj.id])
        button_class = "danger" if obj.is_active else "success"
        return format_html(
            '<a class="button btn-{}" href="{}" style="padding: 5px 10px; border-radius: 4px; '
            'text-decoration: none; background-color: {}; color: white;">{}</a>',
            button_class, url, "#dc3545" if obj.is_active else "#28a745", action
        )

    toggle_activation_button.short_description = "Activation"

    def role(self, obj):
        return "Librarian"

    role.short_description = "Role"
