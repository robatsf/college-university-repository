from django.db import models
import uuid
from django.utils.timezone import now
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from  Authentication.models import DepartmentList 

# ------------------- REQUEST TABLE -------------------
class Request(models.Model):
    user_request_id = models.UUIDField()
    requested_file_id = models.UUIDField()
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)
    description = models.CharField(max_length=255)
    status = models.CharField(max_length=50)



# ------------------- FILE SYSTEM TABLE -------------------
class FileSystem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=50)
    availability = models.BooleanField(default=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)
    department = models.ForeignKey(DepartmentList, on_delete=models.CASCADE, related_name='files', null=True, blank=True)

    def __str__(self):
        return self.title

# ------------------- HISTORY TABLE -------------------
class History(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_history_id = models.UUIDField()
    action = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)

# ------------------- PERMISSIONS TABLE -------------------
class Permissions(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=255)
    permission_level = models.CharField(max_length=255)
    # employees_id = models.ForeignKey(Employee, on_delete=models.CASCADE)

# ------------------- NOTIFICATION TABLE -------------------
class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField()
    message = models.CharField(max_length=255)
    notification_date = models.DateTimeField(default=now)
    is_read = models.BooleanField(default=False)

# ------------------- DOWNLOAD TABLE -------------------
class Download(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField()
    file_id = models.ForeignKey(FileSystem, on_delete=models.CASCADE)
    download_date = models.DateTimeField(default=now)

