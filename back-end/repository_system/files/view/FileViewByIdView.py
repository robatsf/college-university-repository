from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.shortcuts import get_object_or_404
import os
from urllib.parse import unquote
from ..models import FileSystem, Request

class FileViewByIdView(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            file_instance = get_object_or_404(FileSystem, pk=pk)
            original_path = unquote(file_instance.original_file_path)
            filename = os.path.basename(original_path)
            file_path = os.path.join(settings.MEDIA_ROOT, 'files', filename)

            if not os.path.exists(file_path):
                return Response(
                    {"error": "File not found on the server"},
                    status=status.HTTP_404_NOT_FOUND
                )

            relative_url = os.path.join(settings.MEDIA_URL, 'files', filename)
            file_url = request.build_absolute_uri(relative_url)

            user_requested = False
            if hasattr(request.user, 'id') and request.user.id:
                user_requested = Request.objects.filter(requested_file_id=pk, user_request_id=request.user.id).exists()

            payload = {
                "id" : str(file_instance.id),
                "file_url": file_url,
                "title": file_instance.title,
                "author": file_instance.author,
                "department": file_instance.department.name,
                "summary": file_instance.description,
                "year": file_instance.created_at.year if file_instance.created_at else None,
                "file_extension": file_instance.file_extension,
                "size": file_instance.file_size,
                "category": file_instance.department.name,
                "accessLevel": request.user.role == 'guest',
                "asked_request": user_requested
            }

            return Response(payload, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
