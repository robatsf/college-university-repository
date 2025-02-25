# from rest_framework import generics, permissions
# from rest_framework.response import Response
# from rest_framework.exceptions import PermissionDenied
# from rest_framework.decorators import action
# from ..models import DepartmentList
# from ..serializer.DepartmentListSerializer import DepartmentListSerializer
# from ..permissions import DynamicPermission
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated

# class DepartmentListView(generics.ListAPIView):
#     """
#     API view to get departments with different access levels
#     """
#     serializer_class = DepartmentListSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         """
#         Default method to get departments based on user's department_id
#         """
#         user = self.request.user
#         if not user.department_id:
#             raise PermissionDenied("You are not a department head.")

#         return DepartmentList.objects.filter(id=user.department_id_id)

#     def list(self, request, *args, **kwargs):
#         """
#         Override list method to handle both filtered and all departments
#         """
#         get_all = request.query_params.get('all', 'false').lower() == 'true'
        
#         if get_all:
#             if hasattr(request.user, 'is_librarian') and request.user.is_librarian:
#                 queryset = DepartmentList.objects.all()
#             else:
#                 raise PermissionDenied("You don't have permission to view all departments.")
#         else:
#             # Use the default filtered queryset
#             queryset = self.get_queryset()

#         serializer = self.get_serializer(queryset, many=True)
#         return Response({
#             "status": "success",
#             "message": "Departments retrieved successfully",
#             "data": serializer.data
#         })

# serializers.py
from rest_framework import serializers
from ..models import DepartmentList



# views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from ..models import DepartmentList
from ..serializer.DepartmentListSerializer import DepartmentListSerializer
from rest_framework.permissions import AllowAny

class DepartmentListView(generics.ListAPIView):
    """
    API view to get departments with statistics
    """
    serializer_class = DepartmentListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """
        Returns all departments if user is librarian,
        otherwise returns user's department
        """
        user = self.request.user
        get_all = self.request.query_params.get('all', 'false').lower() == 'true'

        if get_all:
            if self.request.user:
                return DepartmentList.objects.all()
            raise PermissionDenied("Only librarians can view all departments")

        if not user.department_id:
            raise PermissionDenied("You are not associated with any department")
        
        return DepartmentList.objects.filter(id=user.department_id_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        # Calculate totals for all departments
        total_stats = {
            'total_departments': queryset.count(),
            'total_files': sum(dept.file_count for dept in queryset),
            'total_downloads': sum(dept.download_total for dept in queryset),
            'total_history': sum(dept.history_total for dept in queryset),
            'total_unapproved': sum(dept.unapproved_files for dept in queryset),
        }

        return Response({
            "status": "success",
            "message": "Departments retrieved successfully",
            "data": {
                "departments": serializer.data,
                "statistics": total_stats
            }
        })