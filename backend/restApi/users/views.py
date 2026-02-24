
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

from rest_framework import generics

from .models import Usage
from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
    ChangePasswordSerializer,
    UsageSerializer,
)

User = get_user_model()



class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    queryset = User.objects.all()


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = ProfileSerializer(
            request.user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)



class ChangePasswordView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not request.user.check_password(serializer.validated_data["old_password"]):
            return Response(
                {"detail": "Incorrect old password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()

        return Response({"detail": "Password updated successfully."})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({"detail": "Logged out successfully."})


class UsageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usage, _ = Usage.objects.get_or_create(user=request.user)
        serializer = UsageSerializer(usage)
        return Response(serializer.data)