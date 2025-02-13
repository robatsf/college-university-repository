from django.urls import path
from .views import GuestRegistrationView, VerifyGuestView, StudentRegistrationView, EmployeeRegistrationView,LoginView
from .security.views.auth_views import LoginView #, TokenRefreshView
from .security.views.password_views import PasswordResetView

urlpatterns = [
    path('register-guest/', GuestRegistrationView.as_view(), name='register-guest'),
    path('verify-guest/<str:token>/', VerifyGuestView.as_view(), name='verify-guest'),
    path('register-student/', StudentRegistrationView.as_view(), name='register-student'),
    path('register-employee/', EmployeeRegistrationView.as_view(), name='register-employee'),
    path('login/', LoginView.as_view(), name='login'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('password/reset/', PasswordResetView.as_view(), name='password-reset')
    # path('login/', LoginView.as_view(), name='login'),
]
