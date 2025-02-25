from django.db import models
import uuid
import os
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import AbstractUser
from multiselectfield import MultiSelectField 
from django.conf import settings



# -------------------- Custom User --------------------
class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('department_head', 'Department Head'),
        ('librarian', 'Librarian'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
        ('guest', 'Guest'),
    ]
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='teacher')
    # Optionally, if the user is tied to a department:
    department = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.username

# ------------------- DepartmentList TABLE -------------------
class DepartmentList(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    file_count = models.PositiveIntegerField(default=0)
    download_total = models.PositiveIntegerField(default=0)
    history_total = models.PositiveIntegerField(default=0)
    unapproved_files = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


# ------------------- REQUEST TABLE -------------------
class Request(models.Model):
    user_request_id = models.UUIDField()
    requested_file_id = models.UUIDField()
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)
    description = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)



# ------------------- FILE SYSTEM TABLE -------------------
# Enum for approval status
class ApprovalStatus(models.TextChoices):
    APPROVED = 'approved', 'Approved'
    UNAPPROVED = 'unapproved', 'Unapproved'
    PENDING = 'pending', 'Pending'

class FileSystem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255 ,null=True)
    author = models.CharField(max_length=255, blank=True, null=True)
    availability = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)
    department = models.ForeignKey('DepartmentList', on_delete=models.CASCADE, related_name='files', null=True, blank=True)
    approved = models.CharField(max_length=10, choices=ApprovalStatus.choices, default=ApprovalStatus.PENDING)
    original_file_path = models.CharField(max_length=1024, blank=True, null=True)
    uploaded_by_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    uploaded_by_id = models.UUIDField(null=True, blank=True)
    uploaded_by = GenericForeignKey('uploaded_by_type', 'uploaded_by_id')
    file_size = models.PositiveIntegerField(default=0)  # Store file size in bytes
    file_extension = models.CharField(max_length=10, blank=True, null=True)  # 
    disapproval_reason = models.CharField(max_length=255 , default=None ,null=True)


    def delete(self, *args, **kwargs):
        """
        Deletes associated files from the filesystem using absolute paths
        """
        try:
            if self.original_file_path:
                absolute_path = os.path.join(settings.MEDIA_ROOT, self.original_file_path.lstrip('/'))
                absolute_path = os.path.normpath(absolute_path)
                
                if os.path.commonpath([absolute_path, settings.MEDIA_ROOT]) == settings.MEDIA_ROOT:
                    if os.path.exists(absolute_path):
                        os.remove(absolute_path)
                    else:
                        print(f"File not found: {absolute_path}")
                else:
                    print(f"Security warning: Attempted to delete file outside MEDIA_ROOT: {absolute_path}")
                    
        except Exception as e:
            print(f"Error deleting file: {str(e)}")
        
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.title

# ------------------- HISTORY TABLE -------------------
class History(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_history_id = models.UUIDField()
    action = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)

# # ------------------- PERMISSIONS TABLE -------------------
# class Permissions(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     role = models.CharField(max_length=255)
#     permission_level = models.CharField(max_length=255)
#     # employees_id = models.ForeignKey(Employee, on_delete=models.CASCADE)
#     created_at = models.DateTimeField(default=now)
#     updated_time = models.DateTimeField(auto_now=True)

# ------------------- NOTIFICATION TABLE -------------------
class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField()
    message = models.CharField(max_length=255)
    notification_date = models.DateTimeField(default=now)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)

# ------------------- DOWNLOAD TABLE -------------------
class Download(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField()
    file_id = models.ForeignKey(FileSystem, on_delete=models.CASCADE)
    download_date = models.DateTimeField(default=now)
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)


# -------------------- PermissionSetting Model --------------------
class PermissionSetting(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('department_head', 'Department Head'),
        ('librarian', 'Librarian'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
        ('guest', 'Guest'),
    ]
    ACTION_CHOICES = [
        ('GET', 'GET'),
        ('POST', 'POST'),
        ('PUT', 'PUT'),
        ('DELETE', 'DELETE'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    actions = MultiSelectField(choices=ACTION_CHOICES, max_length=20, default=['GET'])
    allowed = models.BooleanField(default=False)
    allowed_filter_fields = models.TextField(
        blank=True, null=True,
        default="id,title,author,year,"
        +"type,availability,created_at,updated_time,department,approved,original_file_path,"+
        "file_size,file_extension,uploaded_by,disapproval_reason",
        help_text="Comma separated list of allowed filter fields (e.g. id, title, author, year,"
    )
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.role} - {self.actions} - {self.allowed}"

from django.db import models
from django.utils import timezone
from django.db.models import Count, Q

class SearchQuery(models.Model):
    query = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.query} - {self.created_at}"

class PopularSearch(models.Model):
    query = models.CharField(max_length=255, unique=True)
    count = models.IntegerField(default=1)
    last_searched = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-count', '-last_searched']

    def __str__(self):
        return f"{self.query} ({self.count})"

    @classmethod
    def update_or_create_search(cls, query):
        """Update count for existing query or create new one"""
        obj, created = cls.objects.get_or_create(
            query=query,
            defaults={'count': 1}
        )
        if not created:
            obj.count += 1
            obj.save()
        return obj

    @classmethod
    def get_similar(cls, query, limit=3):
        """Get similar searches based on query"""
        return cls.objects.filter(
            query__icontains=query
        ).exclude(
            query__iexact=query
        ).order_by('-count')[:limit]

class SearchManager:
    @staticmethod
    def record_search(query, ip_address=None):
        """Record a search query and update popular searches"""
        # Record the search query
        search_query = SearchQuery.objects.create(
            query=query,
            ip_address=ip_address
        )
        
        # Update popular searches
        PopularSearch.update_or_create_search(query)
        
        return search_query

    @staticmethod
    def get_recent_searches(limit=5):
        """Get recent searches"""
        return SearchQuery.objects.all()[:limit]

    @staticmethod
    def get_popular_searches():
        """Get popular searches from the last 30 days"""
        one_month_ago = timezone.now() - timezone.timedelta(days=30)
        return PopularSearch.objects.filter(
            last_searched__gte=one_month_ago
        ).order_by('-count')[:5]

    @staticmethod
    def get_similar_searches(query, limit=3):
        """Get similar searches"""
        return PopularSearch.get_similar(query, limit)