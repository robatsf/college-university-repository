import fitz  
import os
from django.http import JsonResponse, Http404
from django.shortcuts import get_object_or_404
from ..models import FileSystem 
from django.conf import settings
import urllib.parse

def extract_pdf_text(request, pk):
    """
    View to extract text from a PDF file, returning a list where each element is a page.
    """
    file_obj = get_object_or_404(FileSystem, id=pk)
    decoded_file_path = urllib.parse.unquote(file_obj.original_file_path)
    corrected_file_path = decoded_file_path.replace("files/media/", "files/")
    file_path = os.path.join(settings.MEDIA_ROOT, corrected_file_path)
    
    file_path = os.path.normpath(file_path) 
    if not os.path.exists(file_path):
        raise Http404("File not found.")

    if not file_path.lower().endswith(".pdf"):
        return JsonResponse({"error": "File is not a PDF"}, status=400)

    pdf_document = fitz.open(file_path)
    extracted_text = {page.number + 1: page.get_text("text") for page in pdf_document}

    return JsonResponse({"pages": extracted_text})
