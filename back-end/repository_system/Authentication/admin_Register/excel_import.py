from django.contrib import admin, messages
from django.utils.html import format_html
from django.urls import path, reverse
from django.contrib.auth.hashers import make_password
from django.shortcuts import redirect, render
from django import forms
from django.http import HttpResponseRedirect, HttpResponse
import pandas as pd
import os
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.utils.text import slugify
import uuid
import tempfile
import logging
import io
from django.core.cache import cache
from ..models import Student
from files.models import DepartmentList
from ..service.services import UserUtils, EmailService

logger = logging.getLogger(__name__)

class ExcelImportForm(forms.Form):
    excel_file = forms.FileField(
        label='Excel File',
        help_text='Upload an Excel file with student data.'
    )
    
    def clean_excel_file(self):
        file = self.cleaned_data['excel_file']
        if not file.name.endswith(('.xls', '.xlsx')):
            raise forms.ValidationError('Only Excel files (.xls, .xlsx) are allowed.')
        return file

class ExcelImportMixin:
    """
    A mixin that adds Excel import functionality to an admin class.
    """
    
    def get_excel_import_urls(self):
        """
        Returns the URLs for Excel import functionality.
        """
        return [
            path(
                'import-excel/',
                self.import_excel_view,
                name='import_excel'
            ),
            path(
                'download-failed-students/',
                self.download_failed_students,
                name='download_failed_students'
            ),
        ]
    
    def import_excel_view(self, request):
        """
        View for uploading and processing the Excel file.
        """
        if request.method == 'POST':
            form = ExcelImportForm(request.POST, request.FILES)
            if form.is_valid():
                excel_file = request.FILES['excel_file']
                success_count, error_count, errors, failed_students_data = self.process_excel_file(excel_file, request)
                
                if success_count > 0:
                    self.message_user(
                        request, 
                        f"Successfully imported {success_count} students.", 
                        messages.SUCCESS
                    )
                if error_count > 0:
                    error_messages = "<br>".join([f"Row {row}: {error}" for row, error in errors])
                    failed_students_file = self.create_failed_students_excel(failed_students_data)
                    
                    # Generate a unique cache key for this user/request
                    cache_key = f"failed_students_file_{request.user.id}_{uuid.uuid4()}"
                    
                    # Store the file path in cache instead of session
                    cache.set(cache_key, failed_students_file, timeout=3600)  # expire after 1 hour
                    
                    # Create a download link in the message with the cache key as a query parameter
                    download_url = f"{reverse('admin:download_failed_students')}?key={cache_key}"
                    self.message_user(
                        request,
                        format_html(
                            f"Failed to import {error_count} students.<br>{error_messages}<br><br>"
                            f"<a href='{download_url}' class='button' style='background: #417690; "
                            f"color: white; padding: 5px 10px; text-decoration: none; border-radius: 4px;'>"
                            f"Download Unregistered Students</a>"
                        ),
                        messages.ERROR
                    )
                    
                    # When there are errors, stay on the same page to show the error messages
                    form = ExcelImportForm()  # Reset the form
                    return render(
                        request,
                        'admin/import_excel.html',
                        {
                            'form': form,
                            'title': 'Import Students from Excel',
                            'opts': self.model._meta,
                            'has_permission': True,
                        }
                    )
                
                # If everything is successful or we only have warnings, redirect to the changelist
                return HttpResponseRedirect(reverse('admin:Authentication_student_changelist'))
        else:
            form = ExcelImportForm()
        
        return render(
            request,
            'admin/import_excel.html',
            {
                'form': form,
                'title': 'Import Students from Excel',
                'opts': self.model._meta,
                'has_permission': True,
            }
        )
    
    def download_failed_students(self, request):
        """
        View for downloading the failed students excel file.
        """
        # Get the cache key from the query parameter
        cache_key = request.GET.get('key')
        
        if not cache_key:
            self.message_user(
                request,
                "Invalid download request. Please try again.",
                messages.ERROR
            )
            return HttpResponseRedirect(reverse('admin:Authentication_student_changelist'))
        
        # Get the file path from cache
        file_path = cache.get(cache_key)
        
        if not file_path or not os.path.exists(file_path):
            self.message_user(
                request,
                "Failed students data is not available for download or has expired.",
                messages.ERROR
            )
            return HttpResponseRedirect(reverse('admin:Authentication_student_changelist'))
        
        # Read the file
        with open(file_path, 'rb') as f:
            file_data = f.read()
        
        # Create HTTP response with the file
        response = HttpResponse(
            file_data,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="unregistered_students.xlsx"'
        
        # Clean up the temporary file
        os.unlink(file_path)
        
        # Delete the cache entry
        cache.delete(cache_key)
        
        return response
    
    def create_failed_students_excel(self, failed_students_data):
        """
        Create an Excel file with failed students data.
        """
        # Create a Pandas DataFrame with the failed students data
        df = pd.DataFrame(failed_students_data)
        
        # Create a temporary file to store the Excel file
        with tempfile.NamedTemporaryFile(suffix='.xlsx', delete=False) as tmp:
            tmp_path = tmp.name
            
        # Write the DataFrame to the Excel file
        df.to_excel(tmp_path, index=False)
        
        return tmp_path

    def process_excel_file(self, excel_file, request):
        """
        Process the uploaded Excel file and create students.
        
        Expected columns:
        - first_name
        - middle_name (optional)
        - last_name
        - email
        - department
        - year
        - profile_image (optional, should be a path or URL)
        """
        success_count = 0
        error_count = 0
        errors = []
        failed_students_data = []
        
        # Save Excel file to a temporary file
        with tempfile.NamedTemporaryFile(suffix='.xlsx', delete=False) as tmp:
            tmp.write(excel_file.read())
            tmp_path = tmp.name
        
        try:
            # Read Excel file
            df = pd.read_excel(tmp_path)
            
            # Remove temporary file
            os.unlink(tmp_path)
            
            required_columns = ['first_name', 'last_name', 'email', 'department', 'year']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                errors.append((0, f"Missing required columns: {', '.join(missing_columns)}"))
                return 0, 1, errors, []
            
            # Process each row
            for index, row in df.iterrows():
                try:
                    # Validate required fields
                    for field in required_columns:
                        if pd.isna(row[field]) or row[field] == '':
                            raise ValueError(f"Missing required field: {field}")
                    
                    # Clean and process data
                    first_name = str(row['first_name']).strip()
                    last_name = str(row['last_name']).strip()
                    email = str(row['email']).strip()
                    department_name = str(row['department']).strip()
                    year = int(row['year'])
                    middle_name = str(row['middle_name']).strip() if 'middle_name' in row and not pd.isna(row['middle_name']) else None
                    
                    # Check if email already exists
                    if Student.objects.filter(email=email).exists():
                        error_msg = f"Student with email {email} already exists."
                        raise ValueError(error_msg)
                    
                    # Validate department
                    department = DepartmentList.objects.filter(name=department_name).first()
                    if not department:
                        error_msg = f"Department '{department_name}' does not exist."
                        self.message_user(
                            request,
                            error_msg,
                            messages.ERROR
                        )
                        # Add to errors list
                        error_count += 1
                        errors.append((index + 2, error_msg))
                        # Add to failed students data
                        failed_row = row.to_dict()
                        failed_row['Error'] = error_msg
                        failed_students_data.append(failed_row)
                        continue
                    
                    # Process profile image if provided
                    profile_image_path = None
                    if 'profile_image' in row and not pd.isna(row['profile_image']) and row['profile_image']:
                        image_path = str(row['profile_image']).strip()
                        profile_image_path = self.process_profile_image(image_path, first_name, last_name)
                    
                    # Generate institutional email and password
                    institutional_email = UserUtils.generate_institutional_email(first_name, last_name, "student")
                    plain_password = UserUtils.generate_password()
                    hashed_password = make_password(plain_password)
                    
                    # Create student
                    student = Student(
                        first_name=first_name,
                        middle_name=middle_name,
                        last_name=last_name,
                        email=email,
                        department=department_name,
                        department_id=department,
                        year=year,
                        institutional_email=institutional_email,
                        password=hashed_password,
                        is_active=True
                    )
                    
                    # Set profile image if available
                    if profile_image_path:
                        student.profile_image = profile_image_path
                    
                    student.save()
                    
                    # Send credentials email
                    try:
                        EmailService.send_credentials_email(
                            first_name, email, institutional_email, plain_password,
                            'Your Hudc institutional email as Student has been created.'
                        )
                    except Exception as e:
                        logger.error(f"Failed to send email to {email}: {str(e)}")
                        errors.append((index + 2, f"Student created but email failed to send: {str(e)}"))
                    
                    success_count += 1
                    
                except Exception as e:
                    error_count += 1
                    error_msg = str(e)
                    errors.append((index + 2, error_msg))
                    
                    # Add to failed students data with error message
                    if index < len(df):  # Ensure we're still within dataframe bounds
                        failed_row = row.to_dict()
                        failed_row['Error'] = error_msg
                        failed_students_data.append(failed_row)
            
            return success_count, error_count, errors, failed_students_data
            
        except Exception as e:
            errors.append((0, f"Error processing Excel file: {str(e)}"))
            return 0, 1, errors, []
    
    def process_profile_image(self, image_path, first_name, last_name):
        """
        Process a profile image from a path or URL and save it to the media directory.
        """
        try:
            # If image_path is a local file
            if os.path.isfile(image_path):
                file_name = os.path.basename(image_path)
                
                # Generate a unique filename
                name_slug = slugify(f"{first_name}-{last_name}")
                unique_id = str(uuid.uuid4())[:8]
                file_ext = os.path.splitext(file_name)[1]
                new_file_name = f"{name_slug}-{unique_id}{file_ext}"
                
                # Save the file to profile_images directory
                new_path = f"profile_images/{new_file_name}"
                
                # Read the image file
                with open(image_path, 'rb') as f:
                    content = f.read()
                
                # Save to storage
                default_storage.save(new_path, ContentFile(content))
                
                return new_path
            else:
                # For now, just return None if not a valid file path
                # In a more advanced implementation, you could handle URLs or implement error handling
                return None
        except Exception as e:
            logger.error(f"Error processing profile image: {str(e)}")
            return None
