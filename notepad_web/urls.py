from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from django.contrib.auth.views import LogoutView
import notepad_web_app.views
import notepad_web_apis.views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('logout/', LogoutView.as_view()),
    path('', notepad_web_app.views.home),
    path('auth/', notepad_web_app.views.authentication),
    path('api/documents/', notepad_web_apis.views.process_documents),
    path('api/email/', notepad_web_apis.views.process_email),
]
