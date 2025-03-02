# admin.py
from django.contrib import admin
from django.urls import reverse, path
from django.utils.html import format_html
from django.core.mail import send_mail
from django.http import HttpResponseRedirect
from django.conf import settings 
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from ..models import Request, FileSystem
from Authentication.models import Guest

SITE_URL = 'http://127.0.0.1:8000'  # This could be dynamic from settings

@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = ('description', 'status', 'created_at', 'action_buttons')
    list_filter = ('status',)
    search_fields = ('user_request_id', 'requested_file_id', 'description')

    # Display action buttons and collapse feature
    def action_buttons(self, obj):
        approve_url = reverse('admin:approve_request', args=[obj.id])
        reject_url = reverse('admin:reject_request', args=[obj.id])
        return format_html("""
            <div style="display: flex; gap: 10px;">
                <a class="button" href="{}" style="background-color: green; color: white; padding: 5px 10px; border-radius: 4px;">Approve</a>
                <a class="button" href="{}" style="background-color: red; color: white; padding: 5px 10px; border-radius: 4px;">Reject</a>
            </div>
        """, approve_url, reject_url)

    action_buttons.short_description = _('Actions')

    # Custom actions to handle approve and reject
    def approve_request(self, request, queryset):
        for req in queryset:
            self._send_approve_email(req)
            req.status = 'approved'
            req.save()

    def reject_request(self, request, queryset):
        for req in queryset:
            self._send_reject_email(req)
            req.status = 'rejected'
            req.save()

    def _send_approve_email(self, request_obj):
        guest = Guest.objects.filter(id=request_obj.user_request_id ).first()
        user_email = guest.email
        file_obj = get_object_or_404(FileSystem, pk=request_obj.requested_file_id)
        download_link = f"{SITE_URL}/api/documents/{file_obj.id}/download/"
        
        subject = "Your Document Request is Approved"
        message = f"""
        Hello,

        Your request for the document '{file_obj.title}' has been approved.
        You can download it using the link below:

        {download_link}

        Best Regards,
        Institutional Repository Team
        """
        send_mail(subject, message, "noreply@example.com", [user_email])

    def _send_reject_email(self, request_obj):
        guest = Guest.objects.filter(id=request_obj.user_request_id ).first()
        user_email = guest.email
        
        subject = "Your Document Request is Rejected"
        message = f"""
        Hello,

        Unfortunately, your request for the document has been rejected.
        If you believe this was an error, please contact support.

        Best Regards,
        Institutional Repository Team
        """
        send_mail(subject, message, "noreply@example.com", [user_email])

    # Disable the ability to add a new Request
    def has_add_permission(self, request):
        return False

    # Optional: Adding collapsible fieldsets (simplified version)
    fieldsets = (
        (None, {
            'fields': ('user_request_id', 'requested_file_id', 'description', 'status')
        }),
    )

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('approve/<int:request_id>/', self.admin_site.admin_view(self.approve_request), name='approve_request'),
            path('reject/<int:request_id>/', self.admin_site.admin_view(self.reject_request), name='reject_request'),
        ]
        return custom_urls + urls

    def approve_request(self, request, request_id):
        obj = get_object_or_404(Request, id=request_id)
        self._send_approve_email(obj)
        obj.status = 'approved'
        obj.save()
        self.message_user(request, "Request has been approved and email sent!")
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

    def reject_request(self, request, request_id):
        obj = get_object_or_404(Request, id=request_id)
        self._send_reject_email(obj)
        obj.status = 'rejected'
        obj.save()
        self.message_user(request, "Request has been rejected and email sent!")
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
