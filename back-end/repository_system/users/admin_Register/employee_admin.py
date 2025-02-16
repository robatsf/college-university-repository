from django.urls import path, reverse
from django.shortcuts import get_object_or_404, redirect
from django.contrib import admin, messages
from django.utils.html import format_html
from django import forms
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from ..models import Employee, DepartmentList
from ..service.services import UserUtils, EmailService

class EmployeeAdminForm(forms.ModelForm):
    class Meta:
        model = Employee
        fields = '__all__'

    def clean_profile_image(self):
        profile_image = self.cleaned_data.get('profile_image')
        if not profile_image and not self.instance.pk:
            raise ValidationError("Profile image is required for new employees.")
        
        if profile_image:
            # Validate file size (max 5MB)
            if profile_image.size > 5 * 1024 * 1024:
                raise ValidationError("Image file size must be less than 5MB.")
            
            # Validate file type
            allowed_types = ['image/jpeg', 'image/png', 'image/jpg']
            if profile_image.content_type not in allowed_types:
                raise ValidationError("Only JPEG, JPG, and PNG files are allowed.")
        
        return profile_image

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    form = EmployeeAdminForm
    list_display = ('first_name', 'middle_name', 'last_name', 'role', 'profile_image_preview', 'email', 
                   'institutional_email', 'status_indicator', 'toggle_activation_button')
    list_filter = ('role', 'department', 'is_active')
    search_fields = ('first_name', 'last_name', 'email', 'institutional_email')
    ordering = ('-created_at',)
    readonly_fields = ('institutional_email',)
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('first_name', 'middle_name', 'last_name', 'profile_image'),
        }),
        ('Employment Details', {
            'fields': ('role', 'department', 'email')
        })
    )

    class Media:
        js = ('admin/js/employee_form.js',)

    def profile_image_preview(self, obj):
        if obj.profile_image:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius: 50%; object-fit: cover;" />',
                obj.profile_image.url
            )
        return format_html('<span style="color: red;">No Image</span>')
    profile_image_preview.short_description = "Profile Image"

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
        employee = get_object_or_404(Employee, id=employee_id)
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

    def status_indicator(self, obj):
        color = "#28a745" if obj.is_active else "#dc3545"
        status_text = "Active" if obj.is_active else "Inactive"
        return format_html(
            '<span style="color: {}; font-weight: bold; padding: 3px 8px; '
            'border-radius: 3px; background-color: {}20;">{}</span>',
            color, color, status_text
        )
    status_indicator.short_description = "Status"

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if db_field.name == 'department':
            departments = list(DepartmentList.objects.all())
            department_choices = [
                ('', '--- Select Department ---')
            ] + [(dept.id, dept.name) for dept in departments]
            
            kwargs['widget'] = forms.Select(
                choices=department_choices,
                attrs={
                    'id': 'id_department_select',
                    'class': 'department-select form-control'
                }
            )
        return super().formfield_for_dbfield(db_field, request, **kwargs)

    def save_model(self, request, obj, form, change):
        if not change:  # New employee
            if not obj.profile_image:
                messages.error(request, "Profile image is required for new employees.")
                return

            # Handle department assignment based on role
            if obj.role == 'teacher':
                department_id = request.POST.get('department')
                if department_id and department_id != 'new':
                    department = DepartmentList.objects.get(id=department_id)
                    obj.department = department.name
            elif obj.role == 'department_head':
                department_name = request.POST.get('department')
                if department_name:
                    department, created = DepartmentList.objects.get_or_create(name=department_name)
                    obj.department = department.name
            elif obj.role == 'librarian':
                obj.department = 'Librarian'

            # Generate institutional email and password
            if not obj.institutional_email:
                obj.institutional_email = UserUtils.generate_institutional_email(
                    obj.first_name, obj.last_name, obj.role
                )
            plain_password = UserUtils.generate_password()
            obj.password = make_password(plain_password)

            try:
                super().save_model(request, obj, form, change)
                EmailService.send_credentials_email(
                    obj.first_name, obj.email, obj.institutional_email, plain_password
                )
                messages.success(
                    request, 
                    f"Employee created successfully. Credentials sent to {obj.email}."
                )
            except Exception as e:
                messages.error(request, f"Error: {str(e)}")
        else:
            super().save_model(request, obj, form, change)

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing existing object
            return self.readonly_fields + ('role',)
        return self.readonly_fields