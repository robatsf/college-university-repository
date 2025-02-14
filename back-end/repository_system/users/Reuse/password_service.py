# services/password_service.py

from rest_framework import exceptions
from ..security.jwt_service import JWTService
from ..service.services import EmailService
from ..service.services import UserUtils

class PasswordService:
    """Service for handling password reset operations"""
    
    @staticmethod
    def reset_password(email: str) -> dict:
        """Reset user password and send temporary password via email"""
        try:
            user, user_type = JWTService.get_user_by_email(email)
            temp_password = UserUtils.generate_password()
            user.password = UserUtils.generate_password(temp_password)
            if hasattr(user, 'ask_for_forget_password'):
                user.ask_for_forget_password = True
            
            user.save()

            EmailService.send_credentials_email(
                first_name=user.first_name if hasattr(user, 'first_name') else user.username,
                email=email,
                institutional_email=getattr(user, 'institutional_email', email),
                password=temp_password,
                type="we Generate temporary password as use below"
            )
            
            return {
                'message': 'Password reset successful. Check your email for temporary password.',
                'user_type': user_type
            }
            
        except Exception as e:
            raise exceptions.ValidationError({"Error" : str(e)},400)
