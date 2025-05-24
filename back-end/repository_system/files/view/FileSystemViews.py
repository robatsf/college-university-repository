from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.contenttypes.models import ContentType
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os

from ..models import FileSystem, PermissionSetting, ApprovalStatus
from ..serializer.FileSystemSerializer import FileSystemSerializer
from ..permissions import DynamicPermission
from ..serializer.DepartmentService import DepartmentService
from .historyViweSet import create_history

class FileSystemViewSet(viewsets.ModelViewSet):
    """
    A working ModelViewSet for files that supports GET, POST, PUT, and DELETE.
    The GET requests are filtered based on the user's role and permissions,
    and file operations (create/update/delete) are restricted accordingly.
    """
    queryset = FileSystem.objects.all()
    serializer_class = FileSystemSerializer
    permission_classes = [IsAuthenticated, DynamicPermission]
    filter_backends = [DjangoFilterBackend]


    def get_queryset(self):
        """
        Filters the queryset based on the current user's role and allowed filter fields.
        """
        queryset = super().get_queryset()
        user_role = self.request.user.role
        allowed_filters = getattr(self.request.user, 'allowed_filter_fields', '').split(',')
        query_params = self.request.query_params

        user_param = query_params.get('user', 'true').lower() == 'true'

        filter_kwargs = {}
        for param, value in query_params.items():
            if value == '' :
                value = None
            if param in allowed_filters:
                filter_kwargs[param] = value

        queryset = queryset.filter(**filter_kwargs)

        # Role-based filtering
        if user_param:
            if user_role == 'department_head':
                queryset = queryset.filter(department=self.request.user.department_id)
            elif user_role in ['librarian', 'teacher', 'student']:
                queryset = queryset.filter(uploaded_by_id=self.request.user.id)

        return queryset


    def perform_create(self, serializer):
        """
        Handles file uploads. It saves the file to MEDIA_ROOT/files and then
        stores the relative file path in the model.
        """
        try:
            user_role = self.request.user.role
            approved_status = ApprovalStatus.APPROVED if user_role == 'department_head' else ApprovalStatus.UNAPPROVED
            uploaded_by_type = ContentType.objects.get_for_model(self.request.user.__class__)

            file = self.request.FILES.get('file')
            if not file:
                raise ValidationError("No file provided.")

            file_size = file.size
            file_extension = os.path.splitext(file.name)[1]

            file_folder = os.path.join(settings.MEDIA_ROOT, 'files')
            if not os.path.exists(file_folder):
                os.makedirs(file_folder)

            file_storage = FileSystemStorage(location=file_folder)
            file_name = file_storage.save(file.name, file)
            file_path = file_storage.url(file_name)
            DepartmentService.update_department(self.request.department_id, file_count=1)

            serializer.save(
                department_id=self.request.department_id,
                approved=approved_status,
                uploaded_by_type=uploaded_by_type,
                uploaded_by_id=self.request.user.id,
                file_size=file_size,
                file_extension=file_extension,
                original_file_path="files"+file_path,
                availability=True
            )
            create_history(self.request.user.id,"Added a file : " + self.request.POST.get('title') or "One file")
        except ValidationError as e:
            raise e
        except Exception as e:
            raise ValidationError(detail="Duplicated file or file can't be saved.")

    def perform_update(self, serializer):
        """
        Updates an existing file. Only the admin or the original uploader is allowed.
        """
        if self.request.user.role != 'admin' and self.request.file_instance.uploaded_by_id != self.request.user.id:
            raise PermissionDenied("You do not have permission to update this file.")
        
        new_file = self.request.FILES.get('file')

        if new_file:
            # Extract the file name
            file_name = os.path.basename(new_file.name)

            # Delete the old file from the storage
            old_file_path = os.path.join(settings.MEDIA_ROOT, self.request.file_instance.original_file_path)
            if os.path.exists(old_file_path):
                os.remove(old_file_path)

            # Save the new file
            file_folder = os.path.join(settings.MEDIA_ROOT, 'files')
            if not os.path.exists(file_folder):
                os.makedirs(file_folder)

            file_storage = FileSystemStorage(location=file_folder)
            saved_file_name = file_storage.save(file_name, new_file)
            file_path = file_storage.url(saved_file_name)

            # Update the serializer with new file details
            serializer.save(
                file_size=new_file.size,
                file_extension=os.path.splitext(file_name)[1],
                original_file_path="files" + file_path,
                disapproval_reason=None
            )
        else:
            serializer.save(
                disapproval_reason=None
            )
            create_history(self.request.user.id,"updated a file : " + self.request.POST.get('title') or "one file")

    def perform_destroy(self, instance):
        """
        Deletes a file. Only the admin or the original uploader can delete it.
        """
        if  self.request.user.role != 'department_head' and instance.uploaded_by_id != self.request.user.id:
            raise PermissionDenied("You do not have permission to delete this file.")
        
        create_history(self.request.user.id,"Deleted a file : One file")
        DepartmentService.update_department(self.request.department_id, file_count=-1)
        instance.delete()
    
    def get_user_role(self, user):
        """
        Dynamically returns the role based on the table name (model).
        """
        user_type = ContentType.objects.get_for_model(user).model  # Get the table name

        # Map table names to roles
        role_mapping = {
            'departmenthead': 'department_head',
            'teacher': 'teacher',
            'student': 'student',
            'librarian': 'librarian',
            'guest' : 'guest'
        }

        return role_mapping.get(user_type, 'NonUser')
