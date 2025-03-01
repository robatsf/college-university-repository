from django.contrib import admin
from ..models import PermissionSetting

@admin.register(PermissionSetting)
class PermissionSettingAdmin(admin.ModelAdmin):
    list_display = ('role', 'actions', 'allowed', 'updated_time','created_at') 
    list_filter = ('role', 'allowed') 
    search_fields = ('role', 'actions') 

    exclude = ('created_at','updated_time')
    readonly_fields = ('updated_time',)

