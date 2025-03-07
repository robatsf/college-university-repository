from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ..models import FileSystem, Request
import uuid

class RequestFileAccessView(APIView):
    def get(self, request, pk, *args, **kwargs):
        """Handles file access request submission."""
        user_id = request.user.id 

        existing_request = Request.objects.filter(
            requested_file_id=pk,
            user_request_id=user_id
        ).exists()

        if existing_request:
            return Response(
                {"message": "Check your email. You have already requested access to this file."},
                status=status.HTTP_400_BAD_REQUEST
            )

        file_instance = get_object_or_404(FileSystem, pk=pk)
        new_request = Request.objects.create(
            user_request_id=user_id,
            requested_file_id=pk,
            description=f"User {getattr(request.user,'username') if hasattr(request.user,'username') else 'user'} with email {request.user.email} requested access to {file_instance.title}.",
            status="Pending"
        )

        return Response(
            {
                "message": "Your request has been submitted successfully.",
                "status": new_request.status,
            },
            status=status.HTTP_201_CREATED
        )
