from django.contrib import admin, messages
from django.utils.html import format_html
from django.urls import path, reverse
from django.contrib.auth.hashers import make_password
from django.shortcuts import redirect
from django import forms
import logging
from ..models import Student
from files.models import DepartmentList
from ..service.services import UserUtils, EmailService
from .excel_import import ExcelImportMixin

logger = logging.getLogger(__name__)

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin, ExcelImportMixin):
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
        js = ('admin/js/student_admin.js',)
    
    def formfield_for_dbfield(self, db_field, request, **kwargs):
        """
        Override the department field to use a select widget populated with choices
        from DepartmentList. This will render a select HTML element.
        """
        if db_field.name == 'department':
            departments = DepartmentList.objects.all()
            department_choices = [('', '--- Select Department ---')]
            for dept in departments:
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
            # Excel import URLs are now handled by the ExcelImportMixin
        ]
        # Combine with Excel import URLs from the mixin
        return self.get_excel_import_urls() + custom_urls + urls
    
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
        return redirect(request.META.get('HTTP_REFERER', 'admin:Authentication_student_changelist'))
    
    def changelist_view(self, request, extra_context=None):
        """
        Override changelist_view to add the import URL to the context
        """
        # Get the original response
        response = super().changelist_view(request, extra_context)
        
        # Add the import URL to the messages for the JavaScript to pick up
        if hasattr(response, 'context_data'):
            messages.info(request, 'EXCEL_IMPORT_URL:' + reverse('admin:import_excel'))
        
        return response
    
    def save_model(self, request, obj, form, change):
        is_new = not change 

        if is_new:
            if obj.department and not obj.department_id:
                department = DepartmentList.objects.filter(name=obj.department).first()
                if department:
                    obj.department_id = department
                else:
                    self.message_user(request, f"Department '{obj.department}' does not exist.", messages.ERROR)
                    return

        if not obj.institutional_email:
            obj.institutional_email = UserUtils.generate_institutional_email(
                obj.first_name, obj.last_name, "student"
            )
        plain_password = UserUtils.generate_password()
        obj.password = make_password(plain_password)
        super().save_model(request, obj, form, change)
        try:
            EmailService.send_credentials_email(
                obj.first_name, obj.email, obj.institutional_email, plain_password,
                'Your Hudc institutional email as Student has been created.'
            )
            self.message_user(request, f"Credentials sent to {obj.email}.", messages.SUCCESS)
        except Exception as e:
            self.message_user(request, f"Error sending email: {str(e)}", messages.ERROR)