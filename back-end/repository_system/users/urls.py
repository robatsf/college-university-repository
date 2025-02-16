from django.urls import path
from .view.GuestRegistertionViwe import GuestRegistrationView
from .view.VerifyGuestView import  VerifyGuestView
from .view.StudentRegistrationView import StudentRegistrationView
from .view.EmployeeRegistrationView import  EmployeeRegistrationView
from .view.Login_views import LoginView
from .view.password_views import PasswordResetView

urlpatterns = [
    path('register-guest/', GuestRegistrationView.as_view(), name='register-guest'),
    path('verify-guest/<str:token>/', VerifyGuestView.as_view(), name='verify-guest'),
    path('register-student/', StudentRegistrationView.as_view(), name='register-student'),
    path('register-employee/', EmployeeRegistrationView.as_view(), name='register-employee'),
    path('login/', LoginView.as_view(), name='login'),
    path('password/reset/', PasswordResetView.as_view(), name='password-reset')
    
]
