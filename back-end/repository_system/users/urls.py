from django.urls import path
from .views import GuestRegistrationView, VerifyGuestView

urlpatterns = [
    path('register-guest/', GuestRegistrationView.as_view(), name='register-guest'),
    path('verify-guest/<str:token>/', VerifyGuestView.as_view(), name='verify-guest'),
]
