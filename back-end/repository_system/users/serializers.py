from rest_framework import serializers
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
import random
import string
from django.contrib.auth.hashers import make_password
from django.urls import reverse
from .models import Guest,Student, Employee

class GuestRegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    class Meta:
        model = Guest
        fields = ['username', 'email', 'password','confirm_password']
    def validate(self, data):
        """Check if password and confirm_password match."""
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        return data
    def create(self, validated_data):
        # Generate a random verification token
        verification_token = get_random_string(length=32)
        validated_data.pop('confirm_password')
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




def generate_password():
    """Generate a random 10-character password"""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=10))

def generate_institutional_email(first_name, last_name):
    """Generate an institutional email based on the student's name"""
    first_letter = first_name[0].lower()
    last_name = last_name.lower()
    return f"{first_letter}{last_name}@dcstudents.edu.et"  # Update domain as needed

class StudentRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['first_name', 'middle_name', 'last_name', 'department', 'year', 'email']

    def create(self, validated_data):
        """Generate institutional email, password, send to user, and save hashed password"""
        student = Student(**validated_data)

        # Generate institutional email
        institutional_email = generate_institutional_email(student.first_name, student.last_name)

        # Generate plain password
        plain_password = generate_password()

        # Send email with credentials
        subject = "Your Institutional Email and Password"
        message = f"""
        Hello {student.first_name},

        Your institutional email has been created.

        Email: {institutional_email}  
        Password: {plain_password}  

        Please log in and change your password.

        Best Regards,  
        Admin Team
        """
        send_mail(subject, message, 'noreply@example.com', [student.email])

        # Save institutional email and hashed password in the database
        student.institutional_email = institutional_email
        student.password = make_password(plain_password)
        student.save()

        return student




def generate_password():
    """Generate a random 10-character password"""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=10))

def generateinstitutional_email(first_name, last_name, role):
    """Generate an institutional email based on role"""
    first_letter = first_name[0].lower()
    last_name = last_name.lower()

    domain_map = {
        "teacher": "dcteacher.edu.et",
        "department_head": "dcdh.edu.et",
        "librarian": "dclibrarian.edu.et",
    }

    domain = domain_map.get(role, "dcteacher.edu.et")  # Default to teacher
    return f"{first_letter}{last_name}@{domain}"

class EmployeeRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['first_name', 'middle_name', 'last_name', 'department', 'role', 'email']

    def create(self, validated_data):
        """Generate institutional email, password, send to user, and save hashed password"""
        employee = Employee(**validated_data)

        # Generate institutional email based on role
        institutional_email = generateinstitutional_email(employee.first_name, employee.last_name, employee.role)

        # Generate plain password
        plain_password = generate_password()

        # Send email with credentials
        subject = "Your Institutional Email and Password"
        message = f"""
        Hello {employee.first_name},

        Your institutional email has been created.

        Email: {institutional_email}  
        Password: {plain_password}  

        Please log in and change your password.

        Best Regards,  
        Admin Team
        """
        send_mail(subject, message, 'noreply@example.com', [employee.email])

        # Save institutional email and hashed password in the database
        employee.institutional_email = institutional_email
        employee.password = make_password(plain_password)
        employee.save()

        return employee
