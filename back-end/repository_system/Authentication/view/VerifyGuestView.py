from rest_framework import generics
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from ..models import Guest
from rest_framework.permissions import AllowAny


class VerifyGuestView(generics.GenericAPIView):
    permission_classes=[AllowAny]
    def get(self, request, token, *args, **kwargs):
        try:
            guest = get_object_or_404(Guest, email_verification_token=token)
            
            context = {
                'success': False,
                'message': '',
                'email': guest.email
            }

            if guest.is_verified:
                context.update({
                    'message': 'Email already verified'
                })
                return render(request, 'verification.html', context)

            guest.is_verified = True
            guest.email_verification_token = None
            guest.save()

            context.update({
                'success': True,
                'message': 'Email verification successful. You can now log in.'
            })
            return render(request, 'verification.html', context)

        except Exception as e:
            context = {
                'success': False,
                'message': f'Verification failed: {str(e)}',
                'email': None
            }
            return render(request, 'verification.html', context)