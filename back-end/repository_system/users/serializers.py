from rest_framework import serializers
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.urls import reverse
from .models import Guest

class GuestRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        # Generate a random verification token
        verification_token = get_random_string(length=32)

        # Hash password before saving
        from django.contrib.auth.hashers import make_password
        validated_data['password'] = make_password(validated_data['password'])

        # Create guest but set `is_verified=False`
        guest = Guest.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_verified=False,  # Not verified yet
            email_verification_token=verification_token 
        )

        # Send verification email
        verification_link = f"http://127.0.0.1:8000/api/users/verify-guest/{verification_token}/"
        subject = "Verify Your Email for Guest Registration"
        message = f"""
        Hello {validated_data['username']},

        Click the link below to verify your email and activate your account:

        {verification_link}

        Best Regards,  
        Institutional Repository System Team
        """
        send_mail(subject, message, 'noreply@example.com', [validated_data['email']])

        return guest
