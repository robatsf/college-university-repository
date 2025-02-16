from rest_framework import generics, status
from django.contrib import messages
from Authentication.models import Librarian
from ..serializer.librarian_serializer import LibrarianRegistrationSerializer
from Authentication.Reuse.ResponseStructure import ResponseStructure

class LibrarianRegistrationView(generics.CreateAPIView):
    queryset = Librarian.objects.all()
    serializer_class = LibrarianRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                librarian = serializer.save()
                data = {
                    "id": str(librarian.id),
                    "first_name": librarian.first_name,
                    "last_name": librarian.last_name,
                    "email": librarian.email,
                    "institutional_email": librarian.institutional_email,
                }
                messages.success(
                    request,
                    f"Librarian created successfully. Credentials sent to {librarian.email}."
                )
                return ResponseStructure.success(
                    data=data,
                    message="Librarian registration successful. Credentials have been sent to the email.",
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
