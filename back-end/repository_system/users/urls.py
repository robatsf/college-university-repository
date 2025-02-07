from django.urls import path
from .views import GuestRegistrationView

urlpatterns = [
    path('register/', GuestRegistrationView.as_view(), name='guest-registration'),
]