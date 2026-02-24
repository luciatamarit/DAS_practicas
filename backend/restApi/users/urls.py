from django.urls import path
from .views import (
    RegisterView,
    ProfileView,
    LogoutView,
    ChangePasswordView,
)

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("profile/password/", ChangePasswordView.as_view()),
    path("logout/", LogoutView.as_view()),
]