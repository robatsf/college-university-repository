from rest_framework import generics, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Guest
from .serializers import GuestRegistrationSerializer

class GuestRegistrationView(generics.CreateAPIView):
    queryset = Guest.objects.all()
    serializer_class = GuestRegistrationSerializer

class VerifyGuestView(generics.GenericAPIView):
    def get(self, request, token, *args, **kwargs):
        # Find the guest by token
        guest = get_object_or_404(Guest, email_verification_token=token)

        # Mark guest as verified
        guest.is_verified = True
        guest.email_verification_token = None  # Remove token after verification
        guest.save()

        return Response({"message": "Your email has been verified! You can now log in."}, status=status.HTTP_200_OK)
