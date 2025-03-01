# file_management/files/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .view.FileSystemViews import FileSystemViewSet

router = DefaultRouter()
router.register(r'files', FileSystemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
