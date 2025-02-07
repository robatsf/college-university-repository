from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    ROLE_CHOICES=[
        ('student','Student'),
        ('department_head','Department Head'),
        ('librarian','Librarian'),
        ('admin','Admin'),
        ('guest','Guest'),
    ]
    role=models.CharField(max_length=20,choices=ROLE_CHOICES, default='guest')

    def __str__(self):
        return self.username