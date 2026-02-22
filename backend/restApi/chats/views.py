from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from rest_framework import status, serializers

from .models import Chat
from .serializers import ChatSerializer

from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Chat, ChatMessage
from .serializers import ChatMessageSerializer, ChatMessageCreateSerializer

from drf_spectacular.utils import extend_schema, inline_serializer,extend_schema_view

class ChatListCreateView(generics.ListCreateAPIView):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Chat.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ChatDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Chat.objects.filter(user=self.request.user)

    def get_object(self):
        return Chat.objects.get(
            id=self.kwargs["chat_id"],
            user=self.request.user
        )
    
@extend_schema_view(
    post=extend_schema(
        request=ChatMessageCreateSerializer,
        responses=ChatMessageSerializer,
    ),
    get=extend_schema(
        responses=ChatMessageSerializer(many=True),
    ),
)

class SendMessageView(generics.ListCreateAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]
    queryset = ChatMessage.objects.all()

    def get_queryset(self):
        return ChatMessage.objects.filter(
            chat__id=self.kwargs["chat_id"],
            chat__user=self.request.user
        ).order_by("created_at")

    def create(self, request, *args, **kwargs):
        serializer = ChatMessageCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        chat = Chat.objects.get(
            id=self.kwargs["chat_id"],
            user=self.request.user
        )

        message = serializer.save(chat=chat, role="user")
        return Response(
            ChatMessageSerializer(message).data,
            status=status.HTTP_201_CREATED
        )