from django.contrib import admin, messages
from django.utils.html import format_html
from django.urls import path, reverse
from django.contrib.auth.hashers import make_password
from django.shortcuts import redirect
from django import forms
from .base_admin import BaseModelAdmin  # if needed
from ..models import Student, DepartmentList
from ..service.services import UserUtils, EmailService

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'middle_name', 'last_name', 'profile_image_preview', 'email', 
                   'institutional_email', 'status_indicator', 'toggle_activation_button')
    search_fields = ('first_name', 'last_name')
    list_filter = ('department',)  
    ordering = ('-created_at',)
    
    # Grouping fields in the edit form into sections.
    fieldsets = (
        ('Personal Information', {
            'fields': ('first_name', 'middle_name','last_name', 'profile_image')
        }),
        ('Academic Information', {
            'fields': ('department', 'email','year')
        }),
    )
    
    class Media:
        css = {
            'all': ('admin/css/student_admin.css',)
        }
        # Optionally, include JS if needed:
        # js = ('admin/js/student_admin.js',)
    
    def formfield_for_dbfield(self, db_field, request, **kwargs):
        """
        Override the department field to use a select widget populated with choices
        from DepartmentList. This will render a select HTML element.
        """
        if db_field.name == 'department':
            departments = DepartmentList.objects.all()
            # Build choices: the empty string option is a placeholder.
            department_choices = [('', '--- Select Department ---')]
            for dept in departments:
                # Use the department name as both the value and display text.
                department_choices.append((dept.name, dept.name))
            kwargs['widget'] = forms.Select(
                choices=department_choices,
                attrs={
                    'id': 'id_department_select',
                    'class': 'department-select'
                }
            )
        return super().formfield_for_dbfield(db_field, request, **kwargs)
    
    def profile_image_preview(self, obj):
        if obj.profile_image:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius: 50%; object-fit: cover;"/>',
                obj.profile_image.url
            )
        return "No Image"
    profile_image_preview.short_description = "Profile Image"
    
    def status_indicator(self, obj):
        color = "green" if obj.is_active else "red"
        status_text = "Active" if obj.is_active else "Inactive"
        return format_html(
            '<span style="color: {}; font-weight: bold; padding: 3px 8px; '
            'border-radius: 3px; background-color: {}20;">{}</span>',
            color, color, status_text
        )
    status_indicator.short_description = "Status"
    
    def toggle_activation_button(self, obj):
        action = "Deactivate" if obj.is_active else "Activate"
        url = reverse('admin:toggle_student_activation', args=[obj.id])
        color = "red" if obj.is_active else "green"
        return format_html(
            '<a class="button toggle-activation" href="{}" style="padding: 5px 10px; border-radius: 4px; '
            'text-decoration: none; background-color: {}; color: white;">{}</a>',
            url, color, action
        )
    toggle_activation_button.short_description = "Activation"
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                'toggle-activation/<uuid:student_id>/',
                self.toggle_activation,
                name='toggle_student_activation'
            ),
        ]
        return custom_urls + urls
    
    def toggle_activation(self, request, student_id):
        student = Student.objects.get(id=student_id)
        student.is_active = not student.is_active
        student.save()
        status_msg = "activated" if student.is_active else "deactivated"
        self.message_user(
            request,
            f"Student {student.first_name} has been {status_msg}.",
            messages.SUCCESS
        )
        return redirect(request.META.get('HTTP_REFERER', 'admin:users_student_changelist'))
    
    def save_model(self, request, obj, form, change):
        if not obj.institutional_email:
            obj.institutional_email = UserUtils.generate_institutional_email(
                obj.first_name, obj.last_name, "student"
            )
        plain_password = UserUtils.generate_password()
        obj.password = make_password(plain_password)
        super().save_model(request, obj, form, change)
        try:
            EmailService.send_credentials_email(
                obj.first_name, obj.email, obj.institutional_email, plain_password
            )
            self.message_user(request, f"Credentials sent to {obj.email}.", messages.SUCCESS)
        except Exception as e:
            self.message_user(request, f"Error sending email: {str(e)}", messages.ERROR)
