from rest_framework import generics, status
from ..models import Guest
from ..serializer.guest_serializer import  GuestRegistrationSerializer
from ..Reuse.ResponseStructure import  ResponseStructure


class GuestRegistrationView(generics.CreateAPIView):
    queryset = Guest.objects.all()
    serializer_class = GuestRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return ResponseStructure.error(
                message="Registration failed",
                errors=[serializer.errors],
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            result = serializer.save()
            return ResponseStructure.success(
                # data=result.get('data'),
                message=result.get('message', "Registration successful. Please check your email for verification."),
                status_code=status.HTTP_201_CREATED
            )
        except Exception as e:
            return ResponseStructure.error(
                message="Registration failed",
                errors=[{"non_field_errors": [str(e)]}],
                status_code=status.HTTP_400_BAD_REQUEST
            )