# your_app/admin/base_admin.py

from django.contrib.admin import SimpleListFilter
from django.db.models import Count
from django.utils.html import format_html
from django.db.models.functions import TruncMonth
from django.db.models import Sum
from django.shortcuts import redirect
from django import forms
from ..models import DepartmentList
from django.contrib.admin import ModelAdmin


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


class BaseModelAdmin(ModelAdmin):
    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return self.readonly_fields + ('created_at', 'updated_time')
        return self.readonly_fields

    def get_list_filter(self, request):
        return self.list_filter + ('created_at',)
    