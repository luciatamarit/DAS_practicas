from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Chat
from .serializers import ChatSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Chat, ChatMessage
from .serializers import ChatMessageSerializer

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
    

class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, chat_id):
        try:
            chat = Chat.objects.get(id=chat_id, user=request.user)
        except Chat.DoesNotExist:
            return Response({"detail": "Chat not found."}, status=status.HTTP_404_NOT_FOUND)

        qs = ChatMessage.objects.filter(chat=chat).order_by("created_at")
        return Response(ChatMessageSerializer(qs, many=True).data, status=status.HTTP_200_OK)

    def post(self, request, chat_id):
        try:
            chat = Chat.objects.get(id=chat_id, user=request.user)
        except Chat.DoesNotExist:
            return Response({"detail": "Chat not found."}, status=status.HTTP_404_NOT_FOUND)

        content = request.data.get("content", "")
        if not content:
            return Response({"content": "This field is required."}, status=status.HTTP_400_BAD_REQUEST)

        msg = ChatMessage.objects.create(chat=chat, role="user", content=content)
        return Response(ChatMessageSerializer(msg).data, status=status.HTTP_201_CREATED)