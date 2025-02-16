from rest_framework import serializers, status
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.contrib.auth.hashers import make_password
import uuid
from ..service.services import EmailService, UserUtils

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
                {"image": f"Error saving image: {e}"},
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
                str(e),
                code=status.HTTP_400_BAD_REQUEST
            )
