

from django.urls import path
#from .views import UsageView, RegisterView, ProfileView, LogoutView, ChangePasswordView
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import UsageView

# urlpatterns = [

#     path("api/users/", include("users.urls")),
    
# ]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/healthcheck/", include("healthcheck.urls")),
    path("api/chats/", include("chats.urls")),
    path("api/users/", include("users.urls")),
    path("api/usage/", UsageView.as_view()),
]

