from django.db import models
import uuid
from django.utils.timezone import now
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

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
    is_active = models.BooleanField(default=True)  # Default: Active

    def save(self, *args, **kwargs):
        """Generate institutional email and hash password before saving."""
        if not self.institutional_email:
            username_part = self.first_name.lower()[0] + self.last_name.lower()
            self.institutional_email = f"{username_part}@dcstudents.edu.et"
        if not self.password:
            self.password = make_password(uuid.uuid4().hex[:8])  # Generate random password
        super().save(*args, **kwargs)

# ------------------- DepartmentList TABLE -------------------
class DepartmentList(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    file_count = models.PositiveIntegerField(default=0)
    download_total = models.PositiveIntegerField(default=0)
    history_total = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

# class Employee(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     first_name = models.CharField(max_length=255)
#     middle_name = models.CharField(max_length=255, blank=True, null=True)
#     last_name = models.CharField(max_length=255)
#     department =  models.CharField(max_length=255, unique=True ,default='unknown')
#     department_id = models.ForeignKey(DepartmentList, on_delete=models.SET_NULL, null=True, blank=True)
#     profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
#     role = models.CharField(
#         max_length=255,
#         choices=[("teacher", "Teacher"), ("librarian", "Librarian"), ("department_head", "Department Head")]
#     )
#     email = models.EmailField(unique=True, null=True)  # Personal email
#     institutional_email = models.EmailField(unique=True)  # System-generated email
#     password = models.CharField(max_length=255)  # Hashed password
#     history_id = models.UUIDField(default=uuid.uuid4, editable=False)
#     created_at = models.DateTimeField(default=now)
#     updated_time = models.DateTimeField(auto_now=True)
#     is_active = models.BooleanField(default=True)  # Activation status

#     def save(self, *args, **kwargs):
#         """Generate institutional email and hash password before saving."""
#         if not self.institutional_email:
#             username_part = self.first_name.lower()[0] + self.last_name.lower()
#             domain_map = {
#                 "teacher": "dcteacher.edu.et",
#                 "librarian": "dclibrarian.edu.et",
#                 "department_head": "dcdh.edu.et"
#             }
#             self.institutional_email = f"{username_part}@{domain_map.get(self.role, 'dcteacher.edu.et')}"

#         if not self.password:
#             self.password = make_password(uuid.uuid4().hex[:8])  # Generate random password

#         super().save(*args, **kwargs)


class Teacher(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255)
    # A fallback char field to store the department name if needed
    department = models.CharField(max_length=255, default='unknown Department')
    # ForeignKey to select a department from the DepartmentList model
    department_id = models.ForeignKey(
        DepartmentList,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    email = models.EmailField(unique=True, null=True)  # Personal email
    institutional_email = models.EmailField(unique=True)  # System-generated email
    password = models.CharField(max_length=255)  # Hashed password
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)  # Activation status

    def save(self, *args, **kwargs):
        # Generate institutional email if not provided
        if not self.institutional_email:
            self.institutional_email = f"{self.first_name.lower()[0]}{self.last_name.lower()}@dcteacher.edu.et"
        # Generate a random password if not provided
        if not self.password:
            self.password = make_password(uuid.uuid4().hex[:8])
        # If a department is selected via the ForeignKey, update the text field accordingly.
        if self.department_id:
            self.department = self.department_id.name
        else:
            # Fallback: if a department name was entered manually, ensure there's a DepartmentList object.
            if self.department:
                try:
                    dept_obj = DepartmentList.objects.get(name=self.department)
                except DepartmentList.DoesNotExist:
                    dept_obj = DepartmentList.objects.create(name=self.department)
                self.department_id = dept_obj
                self.department = dept_obj.name
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Librarian(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    email = models.EmailField(unique=True, null=True)  # Personal email
    institutional_email = models.EmailField(unique=True)  # System-generated email
    password = models.CharField(max_length=255)  # Hashed password
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)  # Activation status

    def save(self, *args, **kwargs):
        if not self.institutional_email:
            self.institutional_email = f"{self.first_name.lower()[0]}{self.last_name.lower()}@dclibrarian.edu.et"
        if not self.password:
            self.password = make_password(uuid.uuid4().hex[:8])
        super().save(*args, **kwargs)


class DepartmentHead(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255)
    department = models.CharField(max_length=255, unique=True, default='unknown Department')
    department_id = models.ForeignKey('DepartmentList', on_delete=models.SET_NULL, null=True, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    email = models.EmailField(unique=True, null=True)  # Personal email
    institutional_email = models.EmailField(unique=True)  # System-generated email
    password = models.CharField(max_length=255)  # Hashed password
    created_at = models.DateTimeField(default=now)
    updated_time = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)  # Activation status

    def save(self, *args, **kwargs):
        # Set institutional email if not provided
        if not self.institutional_email:
            self.institutional_email = f"{self.first_name.lower()[0]}{self.last_name.lower()}@dcdh.edu.et"
        
        # Set a random password if not provided
        if not self.password:
            self.password = make_password(uuid.uuid4().hex[:8])
        
        # Ensure the department exists in DepartmentList
        if self.department:
            try:
                dept_obj = DepartmentList.objects.get(name=self.department)
                raise ValidationError(_("Department already exists in the system."))
            except DepartmentList.DoesNotExist:
                # Create a new department if it doesn't exist
                dept_obj = DepartmentList.objects.create(name=self.department)
            
            self.department_id = dept_obj
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"




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


