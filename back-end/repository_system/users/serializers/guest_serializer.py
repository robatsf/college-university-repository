from rest_framework import serializers, status
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import make_password
from ..models import Guest
from ..service.services import EmailService

class GuestRegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = Guest
        fields = ['username', 'email', 'password', 'confirm_password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match"},
                code=status.HTTP_400_BAD_REQUEST
            )
        return data

    def create(self, validated_data):
        try:
            verification_token = get_random_string(length=32)
            validated_data.pop('confirm_password')
            validated_data['password'] = make_password(validated_data['password'])

            guest = Guest.objects.create(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                is_verified=False,
                email_verification_token=verification_token 
            )

            EmailService.send_verification_email(
                validated_data['username'],
                validated_data['email'],
                verification_token
            )

            return guest
        except Exception as e:
            raise serializers.ValidationError(
                str(e),
                code=status.HTTP_400_BAD_REQUEST
            )
