from django.urls import path
from .views import UsageView

# urlpatterns = [
#     path("usage/", UsageView.as_view(), name="usage"),
# ]


from django.urls import path
from .views import UsageView, RegisterView, ProfileView, LogoutView, ChangePasswordView

urlpatterns = [
    path("usage/", UsageView.as_view(), name="usage"),

    path("users/register/", RegisterView.as_view(), name="register"),
    path("users/profile", ProfileView.as_view(), name="profile"),
    path("users/profile/password", ChangePasswordView.as_view(), name="change_password"),
    path("users/logout", LogoutView.as_view(), name="logout"),
]