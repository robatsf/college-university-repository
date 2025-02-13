import random
import string
from django.core.mail import send_mail

class UserUtils:
    @staticmethod
    def generate_institutional_email(first_name, last_name, role):
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

    @staticmethod
    def generate_password():
        """
        Generates a random password of 10 characters.
        """
        return ''.join(random.choices(string.ascii_letters + string.digits, k=10))

class EmailService:
    @staticmethod
    def send_credentials_email(first_name, recipient_email, institutional_email, password):
        """
        Sends an email containing the generated credentials.
        """
        subject = "Your Institutional Email and Password"
        message = f"""
        Hello {first_name},

        Your institutional email has been created.

        Email: {institutional_email}  
        Password: {password}  

        Please log in and change your password.

        Best Regards,  
        Admin Team
        """

        send_mail(subject, message, 'noreply@example.com', [recipient_email], fail_silently=False)
