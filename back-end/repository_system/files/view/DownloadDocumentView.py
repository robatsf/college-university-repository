from django.http import StreamingHttpResponse, HttpResponseNotFound
from django.shortcuts import get_object_or_404
from django.views import View
from django.conf import settings
import os
import urllib.parse
from .historyViweSet import create_history
from ..serializer.DepartmentService import DepartmentService
from ..models import FileSystem

class DownloadDocumentView(View):
    def get(self, request, doc_id):
        document = get_object_or_404(FileSystem, id=doc_id)
        decoded_file_path = urllib.parse.unquote(document.original_file_path)
        corrected_file_path = decoded_file_path.replace("files/media/", "files/")
        file_path = os.path.join(settings.MEDIA_ROOT, corrected_file_path)
        file_path = os.path.normpath(file_path)  

        if not os.path.exists(file_path):
            return HttpResponseNotFound("File not found")

        def file_iterator(file_name, chunk_size=8192):
            with open(file_name, "rb") as f:
                while chunk := f.read(chunk_size):
                    yield chunk

        response = StreamingHttpResponse(file_iterator(file_path), content_type="application/octet-stream")
        response["Content-Disposition"] = f'attachment; filename="{os.path.basename(file_path)}"'
        DepartmentService.update_department(document.department_id, download_total=1)
        create_history(request.user.id, f"Downloaded document {document.title}")
        return response
