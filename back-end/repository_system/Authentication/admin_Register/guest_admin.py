from django import forms
from django.contrib import admin
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from .base_admin import BaseModelAdmin
from ..models import Guest


class GuestAdminForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput, required=True)
    confirm_password = forms.CharField(widget=forms.PasswordInput, required=True)

    class Meta:
        model = Guest
        fields = ("username", "email", "password")

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")

        if password and confirm_password and password != confirm_password:
            raise ValidationError("Passwords do not match.")

        cleaned_data["password"] = make_password(password)  # Hash the password before saving
        return cleaned_data


@admin.register(Guest)
class GuestAdmin(BaseModelAdmin):
    form = GuestAdminForm  # Use the custom form inside the admin class

    list_display = ('username', 'email', 'is_verified', 'created_at')
    list_filter = ('is_verified',)
    search_fields = ('username', 'email')
    ordering = ('-created_at',)

    fieldsets = (
        ("Personal Information", {
            "fields": ("username", "email")
        }),
        ("Security", {
            "fields": ("password", "confirm_password")
        }),
        ("Verification Details", {
            "fields": ("is_verified",),
        }),
    )

    readonly_fields = ("created_at",)  # Prevent editing timestamps
