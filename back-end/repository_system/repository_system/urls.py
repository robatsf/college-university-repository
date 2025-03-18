from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from .staticImort.wellcomPage import admin_welcome
from .staticImort.dashbord import dashboard

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('Authentication.urls')),
    path('api/files/', include('files.urls')),
    path('', admin_welcome, name='admin_welcome'),
    # path('dashbord/', dashboard , name='dashbord'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
