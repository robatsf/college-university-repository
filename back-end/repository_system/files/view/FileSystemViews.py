from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.contenttypes.models import ContentType
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os
from ..models import FileSystem, PermissionSetting, ApprovalStatus
from ..serializer.FileSystemSerializer import FileSystemSerializer
from ..permissions import DynamicPermission

class FileSystemViewSet(viewsets.ModelViewSet):
    queryset = FileSystem.objects.all()
    serializer_class = FileSystemSerializer
    permission_classes = [IsAuthenticated, DynamicPermission]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['title', 'department', 'approved', 'availability', 'created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        user_role = self.request.user.role
        try:
            perm = PermissionSetting.objects.get(role=user_role, action='GET')
            allowed_filters = []
            if perm.allowed_filter_fields:
                allowed_filters = [f.strip() for f in perm.allowed_filter_fields.split(',')]
            for param in self.request.query_params.keys():
                if param not in allowed_filters and param not in ['page', 'page_size', 'ordering']:
                    return queryset.none()
        except PermissionSetting.DoesNotExist:
            return queryset.none()

        if user_role == 'department_head':
            queryset = queryset.filter(department=self.request.user.department, approved=ApprovalStatus.APPROVED)
        elif user_role in ['librarian', 'teacher', 'student']:
            queryset = queryset.filter(uploaded_by_id=self.request.user.id)
        return queryset

    def perform_create(self, serializer):
        try:
            user_role = self.request.user.role
            approved_status = ApprovalStatus.APPROVED if user_role == 'department_head' else ApprovalStatus.UNAPPROVED
            uploaded_by_type = ContentType.objects.get_for_model(self.request.user.__class__)

            # Get file from the request data
            file = self.request.FILES.get('file')
            if not file:
                raise ValidationError("No file provided.")
            
            file_size = file.size  
            file_extension = os.path.splitext(file.name)[1]

            # Define file folder path and create it if it doesn't exist
            file_folder = os.path.join(settings.MEDIA_ROOT, 'files')
            if not os.path.exists(file_folder):
                os.makedirs(file_folder)

            # Save the file to the folder
            file_storage = FileSystemStorage(location=file_folder)
            file_name = file_storage.save(file.name, file)
            file_path = file_storage.url(file_name)

            # Save the file along with additional fields (size and extension)
            serializer.save(
                approved=approved_status,
                uploaded_by_type=uploaded_by_type,
                uploaded_by_id=self.request.user.id,
                file_size=file_size,
                file_extension=file_extension,
                original_file_path=file_path,
            )
        except ValidationError as e:
            raise e
        except Exception as e:
            raise ValidationError(detail="Dublicated file or file cant be saved ")

    def perform_update(self, serializer):
        """
        Update an existing file.
        """
        file_instance = self.get_object()
        if self.request.user.role != 'admin' and file_instance.uploaded_by_id != self.request.user.id:
            raise PermissionDenied("You do not have permission to update this file.")
        serializer.save()

    def perform_destroy(self, instance):
        """
        Delete a file.
        """
        if self.request.user.role != 'admin' and instance.uploaded_by_id != self.request.user.id:
            raise PermissionDenied("You do not have permission to delete this file.")
        instance.delete()
