from rest_framework import generics, status
from django.contrib import messages
from Authentication.models import Teacher
from ..serializer.teacher_serializer import TeacherRegistrationSerializer
from Authentication.Reuse.ResponseStructure import ResponseStructure

class TeacherRegistrationView(generics.CreateAPIView):
    queryset = Teacher.objects.all()
    serializer_class = TeacherRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                teacher = serializer.save()
                data = {
                    "id": str(teacher.id),
                    "first_name": teacher.first_name,
                    "last_name": teacher.last_name,
                    "email": teacher.email,
                    "institutional_email": teacher.institutional_email,
                }
                messages.success(
                    request,
                    f"Teacher created successfully. Credentials sent to {teacher.email}."
                )
                return ResponseStructure.success(
                    data=data,
                    message="Teacher registration successful. Credentials have been sent to the email.",
                    status_code=status.HTTP_201_CREATED
                )
            except Exception as e:
                return ResponseStructure.error(
                    message="Registration failed.",
                    errors=[{"non_field_errors": [str(e)]}],
                    status_code=status.HTTP_400_BAD_REQUEST
                )
        else:
            return ResponseStructure.error(
                message="Registration failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
