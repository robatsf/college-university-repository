# your_app/admin/base_admin.py

from django.contrib.admin import SimpleListFilter
from django.contrib.admin import ModelAdmin
from django.contrib import admin
from ..models import Backup, Recovery
from django.utils.html import format_html
import os
from django.conf import settings
from django.utils import timezone
from django.core.management import call_command
import uuid
import shutil
import subprocess
from django.utils.safestring import mark_safe


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

    # def get_list_filter(self, request):
    #     return self.list_filter + ('created_at',)
    

class RecoveryInline(admin.TabularInline):
    model = Recovery
    extra = 0
    readonly_fields = ('recovered_by', 'recovered_at', 'notes')
    can_delete = False

class BackupAdmin(admin.ModelAdmin):
    list_display = ( 'notes', 'created_at','download_link', 'recover_action')
    inlines = [RecoveryInline]
    readonly_fields = ('created_at', 'file_path')

    # List of tables to include in backup/restore (update as needed)
    # Exclude files_backup, files_recovery, and all Django auth/admin/session tables
    BACKUP_TABLES = [
        'Authentication_departmenthead',
        'Authentication_guest',
        'Authentication_librarian',
        'Authentication_student',
        'Authentication_teacher',
        # 'files_customuser',  # <-- Excluded!
        # 'files_customuser_groups',  # <-- Excluded!
        # 'files_customuser_user_permissions',  # <-- Excluded!
        'files_departmentlist',
        'files_download',
        'files_filesystem',
        'files_history',
        'files_notification',
        'files_permissionsetting',
        'files_popularsearch',
        'files_request',
        'files_searchquery',
        # DO NOT include auth_user, auth_group, auth_group_permissions, auth_permission,
        # django_admin_log, django_content_type, django_migrations, django_session, etc.
    ]

    def save_model(self, request, obj, form, change):
        # Only dump selected tables
        backup_dir = os.path.join(settings.MEDIA_ROOT, 'db_backups')
        os.makedirs(backup_dir, exist_ok=True)
        filename = f"backup_{timezone.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex}.sql"
        file_path = os.path.join(backup_dir, filename)
        db_path = settings.DATABASES['default']['NAME']
        table_list = ' '.join(self.BACKUP_TABLES)
        with open(file_path, 'w') as f:
            subprocess.run(['sqlite3', db_path, f'.dump {table_list}'], stdout=f, check=True)
        obj.file_path = os.path.relpath(file_path, settings.MEDIA_ROOT)
        super().save_model(request, obj, form, change)

    def changelist_view(self, request, extra_context=None):
        if 'backup_now' in request.GET:
            backup_dir = os.path.join(settings.MEDIA_ROOT, 'db_backups')
            os.makedirs(backup_dir, exist_ok=True)
            filename = f"backup_{timezone.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex}.sql"
            file_path = os.path.join(backup_dir, filename)
            db_path = settings.DATABASES['default']['NAME']
            table_list = ' '.join(self.BACKUP_TABLES)
            with open(file_path, 'w') as f:
                subprocess.run(['sqlite3', db_path, f'.dump {table_list}'], stdout=f, check=True)
            rel_path = os.path.relpath(file_path, settings.MEDIA_ROOT)
            Backup.objects.create(file_path=rel_path, notes='Created via admin button.')
            self.message_user(request, f'Backup created: {rel_path}')
            from django.shortcuts import redirect
            return redirect(request.path)
        extra_context = extra_context or {}
        extra_context['backup_now_url'] = request.get_full_path() + ('&' if '?' in request.get_full_path() else '?') + 'backup_now=1'
        return super().changelist_view(request, extra_context=extra_context)

    def download_link(self, obj):
        if obj.file_path:
            url = f"{settings.MEDIA_URL}{obj.file_path}"
            return format_html('<a href="{}" download>Download</a>', url)
        return '-'
    download_link.short_description = 'Download Backup'

    def recover_action(self, obj):
        return format_html(
            '<a class="button" href="recover/{}/" style="background:#007bff;color:#fff;padding:3px 8px;border-radius:3px;">Recover to this state</a>',
            obj.id
        )
    recover_action.short_description = 'Recover'

    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path('recover/<uuid:backup_id>/', self.admin_site.admin_view(self.recover_view), name='backup_recover'),
        ]
        return custom_urls + urls

    def get_inline_instances(self, request, obj=None):
        # Only show RecoveryInline on the change (edit) form
        if obj is not None:
            return super().get_inline_instances(request, obj)
        return []

    def recover_view(self, request, backup_id):
        from django.shortcuts import redirect
        from django.contrib import messages
        from django.utils.html import escape
        backup = Backup.objects.get(id=backup_id)
        db_path = settings.DATABASES['default']['NAME']
        sql_file = os.path.join(settings.MEDIA_ROOT, backup.file_path)
        if request.method == 'POST':
            try:
                # 1. Dump current state to a string
                table_list = ' '.join(self.BACKUP_TABLES)
                result = subprocess.run(['sqlite3', db_path, f'.dump {table_list}'], capture_output=True, text=True, check=True)
                current_sql = result.stdout
                # 2. Compare to the most recent backup (excluding auto-backups for this logic if you want)
                prev_backup = None
                for b in Backup.objects.exclude(id=backup.id).order_by('-created_at'):
                    prev_sql_path = os.path.join(settings.MEDIA_ROOT, b.file_path)
                    if os.path.exists(prev_sql_path):
                        with open(prev_sql_path, 'r') as f:
                            prev_sql = f.read()
                        if prev_sql == current_sql:
                            prev_backup = b
                            break
                # 3. If not found, create a new backup
                if not prev_backup:
                    backup_dir = os.path.join(settings.MEDIA_ROOT, 'db_backups')
                    os.makedirs(backup_dir, exist_ok=True)
                    filename = f"autobackup_before_restore_{timezone.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex}.sql"
                    file_path = os.path.join(backup_dir, filename)
                    with open(file_path, 'w') as f:
                        f.write(current_sql)
                    prev_backup = Backup.objects.create(file_path=os.path.relpath(file_path, settings.MEDIA_ROOT), notes='Auto-backup before restore')
                # 4. Only clear and restore selected tables
                for table in self.BACKUP_TABLES:
                    subprocess.run(['sqlite3', db_path, f'DELETE FROM {table};'], check=True)
                subprocess.run(['sqlite3', db_path, f".read {sql_file}"], check=True)
                Recovery.objects.create(
                    backup=backup,
                    recovered_by=str(request.user),
                    recovered_at=timezone.now(),
                    notes=f'Recovered via admin action. Previous state backed up as {prev_backup.file_path}'
                )
                messages.success(request, f'Successfully restored the selected tables to backup: {backup.file_path}. Previous state saved as {prev_backup.file_path}')
            except Exception as e:
                messages.error(request, f'Failed to restore backup: {e}')
            return redirect('/admin/')
        # Render a minimal confirmation form
        csrf_token = request.COOKIES.get('csrftoken', '')
        html = f'''
            <html><head><title>Confirm Database Restore</title></head><body style="font-family:sans-serif;max-width:600px;margin:40px auto;">
            <h2 style="color:#dc3545;">Are you sure you want to restore the selected tables to this backup?</h2>
            <p><b>This will overwrite all current data in those tables.</b></p>
            <form method="post">
                <input type="hidden" name="csrfmiddlewaretoken" value="{escape(csrf_token)}">
                <button type="submit" style="background:#dc3545;color:#fff;padding:8px 16px;border:none;border-radius:4px;font-size:16px;">Yes, restore to this backup</button>
                <a href="/admin/" style="margin-left:20px;">Cancel</a>
            </form>
            </body></html>
        '''
        from django.http import HttpResponse
        return HttpResponse(html)

    class Media:
        js = ('admin/js/jquery.init.js',)

    def get_readonly_fields(self, request, obj=None):
        # Make file_path always read-only
        return self.readonly_fields
        
    def get_changelist_instance(self, request):
        cl = super().get_changelist_instance(request)
        cl.title = 'Backup and Recovery'
        return cl

admin.site.register(Backup, BackupAdmin)

