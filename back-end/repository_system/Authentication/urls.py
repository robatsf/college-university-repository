from django.urls import path
from .view.GuestRegistertionViwe import GuestRegistrationView
from .view.VerifyGuestView import  VerifyGuestView
from .view.StudentRegistrationView import StudentRegistrationView
from .view.teacher_registration_view import TeacherRegistrationView
from .view.department_head_registration_view import DepartmentHeadRegistrationView
from .view.librarian_registration_view import LibrarianRegistrationView
from .view.Login_views import LoginView
from .view.password_views import PasswordResetView

urlpatterns = [
    path('register-guest/', GuestRegistrationView.as_view(), name='register-guest'),
    path('verify-guest/<str:token>/', VerifyGuestView.as_view(), name='verify-guest'),
    path('register-student/', StudentRegistrationView.as_view(), name='register-student'),
    path('register/teacher/', TeacherRegistrationView.as_view(), name='teacher-register'),
    path('register/department-head/', DepartmentHeadRegistrationView.as_view(), name='department-head-register'),
    path('register/librarian/', LibrarianRegistrationView.as_view(), name='librarian-register'),
    path('login/', LoginView.as_view(), name='login'),
    path('password/reset/', PasswordResetView.as_view(), name='password-reset')
    
]
