from rest_framework import generics, status
from django.contrib import messages
from Authentication.models import DepartmentHead
from ..serializer.department_head_serializer import DepartmentHeadRegistrationSerializer
from Authentication.Reuse.ResponseStructure import ResponseStructure

class DepartmentHeadRegistrationView(generics.CreateAPIView):
    queryset = DepartmentHead.objects.all()
    serializer_class = DepartmentHeadRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                dept_head = serializer.save()
                data = {
                    "id": str(dept_head.id),
                    "first_name": dept_head.first_name,
                    "last_name": dept_head.last_name,
                    "email": dept_head.email,
                    "institutional_email": dept_head.institutional_email,
                }
                messages.success(
                    request,
                    f"Department Head created successfully. Credentials sent to {dept_head.email}."
                )
                return ResponseStructure.success(
                    data=data,
                    message="Department Head registration successful. Credentials have been sent to the email.",
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
