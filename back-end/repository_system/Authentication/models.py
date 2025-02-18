from django.db import models
import uuid
from django.utils.timezone import now
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from files.models import DepartmentList

# ------------------- STUDENT TABLE -------------------
class Student(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    year = models.IntegerField()
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    email = models.EmailField(unique=True,null=True)  # Personal email
    institutional_email = models.EmailField(unique=True)  # System-generated email
    password = models.CharField(max_length=255)  # Hashed password
    ask_for_forget_password = models.BooleanField(default=False)
    history_id = models.UUIDField(default=uuid.uuid4, editable=False )
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True) 



class Teacher(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255)
    department = models.CharField(max_length=255, default='Add Department')
    department_id = models.ForeignKey(
        DepartmentList,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    email = models.EmailField(unique=True, null=True) 
    institutional_email = models.EmailField(unique=True) 
    password = models.CharField(max_length=255) 
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True) 


class Librarian(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    email = models.EmailField(unique=True, null=True)  
    institutional_email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)  



class DepartmentHead(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255)
    department = models.CharField(max_length=255, unique=True, default='unknown Department')
    department_id = models.ForeignKey(DepartmentList, on_delete=models.SET_NULL, null=True, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    email = models.EmailField(unique=True, null=True)  # Personal email
    institutional_email = models.EmailField(unique=True)  # System-generated email
    password = models.CharField(max_length=255)  # Hashed password
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)  # Activation status

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.department})"




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
    is_active = models.BooleanField(default=True)  


