from rest_framework import serializers, status
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import make_password
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import uuid
from .models import Guest, Student, Employee
from .Reuse.services import EmailService, UserUtils

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
                e,
                code=status.HTTP_400_BAD_REQUEST
            )

class BaseUserRegistrationSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False)
    
    def save_profile_image(self, image):
        if not image:
            return None
            
        try:
            ext = image.name.split('.')[-1]
            filename = f'profile_images/{uuid.uuid4()}.{ext}'
            path = default_storage.save(filename, ContentFile(image.read()))
            return path
        except Exception as e:
            raise serializers.ValidationError(
                {"image" : f"Error saving image: {e}"},
                code=status.HTTP_400_BAD_REQUEST
            )
    
    def create_user_with_credentials(self, validated_data, role=None):
        try:
            profile_image = validated_data.pop('profile_image', None)
            user = self.Meta.model(**validated_data)
            
            if profile_image:
                user.profile_image = self.save_profile_image(profile_image)
            
            institutional_email = UserUtils.generate_institutional_email(
                user.first_name, 
                user.last_name,
                role
            )
            plain_password = UserUtils.generate_password()

            EmailService.send_credentials_email(
                user.first_name,
                user.email,
                institutional_email,
                plain_password
            )

            user.institutional_email = institutional_email
            user.password = make_password(plain_password)
            user.save()

            return user
        except Exception as e:
            raise serializers.ValidationError(
                e,
                code=status.HTTP_400_BAD_REQUEST
            )

class StudentRegistrationSerializer(BaseUserRegistrationSerializer):
    profile_image = serializers.ImageField(required=False)
    class Meta:
        model = Student
        fields = ['first_name', 'middle_name', 'last_name', 'department', 
                 'year', 'email', 'profile_image']

    def create(self, validated_data):
        try:
            return self.create_user_with_credentials(validated_data)
        except Exception as e:
            raise serializers.ValidationError(
                e,
                code=status.HTTP_400_BAD_REQUEST
            )

class EmployeeRegistrationSerializer(BaseUserRegistrationSerializer):
    class Meta:
        model = Employee
        fields = ['first_name', 'middle_name', 'last_name', 'department', 
                 'role', 'email', 'profile_image']

    def create(self, validated_data):
        try:
            return self.create_user_with_credentials(
                validated_data, 
                validated_data['role']
            )
        except Exception as e:
            raise serializers.ValidationError(
                e,
                code=status.HTTP_400_BAD_REQUEST
            )