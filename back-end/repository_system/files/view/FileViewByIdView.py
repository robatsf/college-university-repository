from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.shortcuts import get_object_or_404
import os
from urllib.parse import unquote
from ..models import FileSystem

class FileViewByIdView(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            # Get the file instance
            file_instance = get_object_or_404(FileSystem, pk=pk)
            
            # Get the original filename from the stored path
            original_path = unquote(file_instance.original_file_path)
            filename = os.path.basename(original_path)
            
            # Construct the server file path using MEDIA_ROOT
            file_path = os.path.join(settings.MEDIA_ROOT, 'files', filename)
            
            if not os.path.exists(file_path):
                return Response(
                    {"error": "File not found on the server"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Build the public URL to the file using MEDIA_URL
            # Assumes that MEDIA_URL is configured correctly and files are served from there.
            relative_url = os.path.join(settings.MEDIA_URL, 'files', filename)
            file_url = request.build_absolute_uri(relative_url)

            return Response({"file_url": file_url}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error: {str(e)}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
