from django.contrib import admin
from .admin_Register.student_admin import StudentAdmin
from .admin_Register.employee_admin import EmployeeAdmin
from .admin_Register.request_admin import RequestAdmin
from .admin_Register.guest_admin import GuestAdmin
from .admin_Register.permissions_admin import PermissionsAdmin
from django.contrib import admin
from django.contrib.auth.models import User, Group

# Unregister the default User and Group models
admin.site.unregister(User)
admin.site.unregister(Group)
