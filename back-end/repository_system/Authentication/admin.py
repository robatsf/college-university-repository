from django.contrib import admin
from .admin_Register.student_admin import StudentAdmin
from .admin_Register.guest_admin import GuestAdmin
from django.contrib.auth.models import User, Group
from .admin_Register.department_head_admin import DepartmentHeadAdmin
from .admin_Register.librarian_admin import LibrarianAdmin
from .admin_Register.teacher_admin import TeacherAdmin

# Unregister the default User and Group models
admin.site.unregister(User)
admin.site.unregister(Group)
