from django.db import models
import uuid
from django.utils.timezone import now
from django.contrib.auth.hashers import make_password


# ------------------- STUDENT TABLE -------------------
class Student(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    year = models.IntegerField()
    profile_image = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True,null=True)  # Personal email
    institutional_email = models.EmailField(unique=True)  # System-generated email
    password = models.CharField(max_length=255)  # Hashed password
    ask_for_forget_password = models.BooleanField(default=False)
    history_id = models.UUIDField(default=uuid.uuid4, editable=False )
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        """Generate institutional email and hash password before saving."""
        if not self.institutional_email:
            username_part = self.first_name.lower()[0] + self.last_name.lower()
            self.institutional_email = f"{username_part}@dcstudents.edu.et"
        if not self.password:
            self.password = make_password(uuid.uuid4().hex[:8])  # Generate random password
        super().save(*args, **kwargs)


# ------------------- EMPLOYEE TABLE -------------------
class Employee(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    role = models.CharField(max_length=255, choices=[("teacher", "Teacher"), ("librarian", "Librarian"), ("department_head", "Department Head")])
    email = models.EmailField(unique=True,null=True)  # Personal email
    institutional_email = models.EmailField(unique=True)  # System-generated email
    password = models.CharField(max_length=255)  # Hashed password
    history_id = models.UUIDField( default=uuid.uuid4 ,editable=False)
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        """Generate institutional email based on role and hash password before saving."""
        if not self.institutional_email:
            username_part = self.first_name.lower()[0] + self.last_name.lower()
            domain_map = {
                "teacher": "dcteacher.edu.et",
                "librarian": "dclibrarian.edu.et",
                "department_head": "dcdh.edu.et"
            }
            self.institutional_email = f"{username_part}@{domain_map.get(self.role, 'dcteacher.edu.et')}"
        if not self.password:
            self.password = make_password(uuid.uuid4().hex[:8])  # Generate random password
        super().save(*args, **kwargs)


# ------------------- GUEST TABLE -------------------
class Guest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Hashed password
    request_id = models.UUIDField(default=uuid.uuid4, editable=False)    
    history_id = models.UUIDField( default=uuid.uuid4, editable=False)
    is_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=100, unique=True, blank=True, null=True) 
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)

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
    employees_id = models.ForeignKey(Employee, on_delete=models.CASCADE)

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

# ------------------- ADMIN TABLE -------------------
class Admin(models.Model):
    admin_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=255)
    password = models.CharField(max_length=255)  # Hashed password
    column_5 = models.IntegerField()
    updated_time = models.DateTimeField(auto_now=True)
