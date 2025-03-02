from django.shortcuts import render

def admin_welcome(request):
    return render(request, 'welcome.html', {'title': 'Admin Welcome Page'})
