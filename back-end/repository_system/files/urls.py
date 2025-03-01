from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .view.custom_views import FileListView, FileCreateView, FileUpdateView, FileDeleteView
from .view.get_all_departments import DepartmentListView
from .view.changepassword import ChangePasswordView
from .view.FileViewByIdView import FileViewByIdView
from .view.RefreshTokenViwe import TokenRefreshView
from .view.approve_fileViwe import approve_file
from .view.PublicFileSearchViewSet import PublicFileSearchViewSet
from .view.historyViweSet import get_recent_activities
from .view.RequestFileAccessView import RequestFileAccessView
from .view.DownloadDocumentView import DownloadDocumentView

router = DefaultRouter()
router.register(r'search', PublicFileSearchViewSet, basename='search')

urlpatterns = [
    path('list/', FileListView.as_view(), name='file-list'),
    path('create/', FileCreateView.as_view(), name='file-create'),
    path('update/<uuid:pk>/', FileUpdateView.as_view(), name='file-update'),
    path('delete/<uuid:pk>/', FileDeleteView.as_view(), name='file-delete'),
    path("departments/", DepartmentListView.as_view(), name="department-list"),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('view/<uuid:pk>/', FileViewByIdView.as_view(), name='file-view'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('approval/<uuid:pk>/', approve_file, name='approve_file'),
    path('activities/recent/', get_recent_activities, name='recent-activities'),
    path('request-access/<uuid:pk>/', RequestFileAccessView.as_view(), name='request-file-access'),
    path("documents/<uuid:doc_id>/download/", DownloadDocumentView.as_view(), name="download_document"),
    path('', include(router.urls)),
]