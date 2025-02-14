from django.core.mail import send_mail
import random
import string

class EmailService:
    """Handles email-related functionality for user management"""
    
    @staticmethod
    def send_verification_email(username, email, verification_token):
        verification_link = f"http://127.0.0.1:8000/api/users/verify-guest/{verification_token}/"
        subject = "Verify Your Email for Guest Registration"
        message = f"""
        Hello {username},

        Click the link below to verify your email and activate your account:

        {verification_link}

        Best Regards,  
        Institutional Repository System Team
        """
        send_mail(subject, message, 'noreply@example.com', [email])

    @staticmethod
    def send_credentials_email(first_name, email, institutional_email, password,type='Your institutional email has been created.'):
        subject = "Your Institutional Email and Password"
        message = f"""
        Hello {first_name},

        {type}

        Email: {institutional_email}  
        Password: {password}  

        Please log in and change your password.

        Best Regards,  
        Admin Team
        """
        send_mail(subject, message, 'noreply@example.com', [email],fail_silently=False)

class UserUtils:
    """Utility functions for user management"""
    
    @staticmethod
    def generate_password(length=10):
        """Generate a random password"""
        return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

    @staticmethod
    def generate_institutional_email(first_name, last_name, role=None):
        """
        Generates an institutional email based on the user's role.
        """
        username = f"{first_name.lower()[0]}{last_name.lower()}"
        domain = {
            "student": "dcstudents.edu.et",
            "teacher": "dcteacher.edu.et",
            "department_head": "dcdh.edu.et",
            "librarian": "dclibrarian.edu.et"
        }.get(role, "default.edu.et")

        return f"{username}@{domain}"
    
    