# services/jwt_service.py

from datetime import datetime, timedelta
from typing import Dict, Optional
import jwt
from django.conf import settings
from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from ..models import Student, Employee, Guest

class JWTService:
    """Service for handling JWT token operations"""
    
    @staticmethod
    def get_user_by_email(email: str, password: str):
        """Get user from database based on institutional email domain"""
        try:
            domain = email.split('@')[1]
            
            # Check employee domains
            employee_domains = {
                "dcteacher.edu.et": "teacher",
                "dclibrarian.edu.et": "librarian",
                "dcdh.edu.et": "department_head"
            }
            
            if domain in employee_domains:
                try:
                    user = Employee.objects.get(institutional_email=email)
                    if not user.check_password(password):
                        raise exceptions.AuthenticationFailed('Invalid credentials')
                    return user, 'employee'
                except Employee.DoesNotExist:
                    raise exceptions.AuthenticationFailed('User not found')
                    
            # Check student domain
            elif domain == "dcstudents.edu.et":
                try:
                    user = Student.objects.get(institutional_email=email)
                    if not user.check_password(password):
                        raise exceptions.AuthenticationFailed('Invalid credentials')
                    return user, 'student'
                except Student.DoesNotExist:
                    raise exceptions.AuthenticationFailed('User not found')
            
            # Check guest (normal email)
            else:
                try:
                    user = Guest.objects.get(email=email)
                    if not user.check_password(password):
                        raise exceptions.AuthenticationFailed('Invalid credentials')
                    if not user.is_verified:
                        raise exceptions.AuthenticationFailed('Email not verified')
                    return user, 'guest'
                except Guest.DoesNotExist:
                    raise exceptions.AuthenticationFailed('User not found')
                    
        except Exception as e:
            raise exceptions.AuthenticationFailed(str(e))

    @staticmethod
    def generate_token(user, user_type: str) -> Dict[str, str]:
        """Generate access and refresh tokens for a user"""
        
        # Base payload data
        payload_data = {
            'user_id': str(user.id),
            'email': user.institutional_email if hasattr(user, 'institutional_email') else user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'user_type': user_type,
        }

        # Add type-specific data
        if user_type == 'student':
            payload_data.update({
                'role': 'student',
                'year': user.year,
                'department': user.department
            })
        elif user_type == 'employee':
            payload_data.update({
                'role': user.role,
                'department': user.department
            })
        else:  # guest
            payload_data.update({
                'role': 'guest',
                'username': user.username,
                'is_verified': user.is_verified
            })

        # Generate access token
        access_token_payload = {
            **payload_data,
            'exp': datetime.utcnow() + timedelta(minutes=60),  # 1 hour expiry
            'iat': datetime.utcnow(),
            'token_type': 'access'
        }
        
        # Generate refresh token
        refresh_token_payload = {
            **payload_data,
            'exp': datetime.utcnow() + timedelta(days=7),  # 7 days expiry
            'iat': datetime.utcnow(),
            'token_type': 'refresh'
        }

        access_token = jwt.encode(
            access_token_payload, 
            settings.SECRET_KEY, 
            algorithm='HS256'
        )
        
        refresh_token = jwt.encode(
            refresh_token_payload, 
            settings.SECRET_KEY, 
            algorithm='HS256'
        )

        return {
            'access_token': access_token,
            'refresh_token': refresh_token
        }

    @staticmethod
    def verify_token(token: str) -> Dict:
        """Verify and decode a JWT token"""
        try:
            payload = jwt.decode(
                token, 
                settings.SECRET_KEY, 
                algorithms=['HS256']
            )
            return payload
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token')

    @staticmethod
    def refresh_access_token(refresh_token: str) -> str:
        """Generate new access token using refresh token"""
        try:
            payload = JWTService.verify_token(refresh_token)
            
            if payload['token_type'] != 'refresh':
                raise exceptions.AuthenticationFailed('Invalid token type')

            # Create new access token with same payload but new expiry
            new_payload = {**payload}
            new_payload.update({
                'exp': datetime.utcnow() + timedelta(minutes=60),
                'iat': datetime.utcnow(),
                'token_type': 'access'
            })

            return jwt.encode(
                new_payload, 
                settings.SECRET_KEY, 
                algorithm='HS256'
            )
        except Exception as e:
            raise exceptions.AuthenticationFailed(str(e))

class JWTAuthentication(BaseAuthentication):
    """Custom authentication class for DRF"""

    def authenticate(self, request):
        auth_header = get_authorization_header(request).decode('utf-8')
        
        if not auth_header or 'Bearer' not in auth_header:
            return None

        try:
            token = auth_header.split(' ')[1]
            payload = JWTService.verify_token(token)
            
            # Get user based on user_type
            user_type = payload.get('user_type')
            user_id = payload.get('user_id')
            
            if user_type == 'student':
                user = Student.objects.get(id=user_id)
            elif user_type == 'employee':
                user = Employee.objects.get(id=user_id)
            else:  # guest
                user = Guest.objects.get(id=user_id)
                
            return (user, token)
        except Exception as e:
            raise exceptions.AuthenticationFailed(str(e))