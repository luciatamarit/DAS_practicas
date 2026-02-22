from django.shortcuts import render

from django.utils import timezone
from datetime import timedelta
from users.models import Usage

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

import json
import urllib.request

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

        usage, _ = Usage.objects.get_or_create(user=request.user)

        now = timezone.now()

        if now >= usage.reset_date:
            usage.messages_used = 0
            usage.reset_date = now + timedelta(days=30)

        # Comprobar límite
        if usage.messages_used >= usage.messages_limit:
            return Response(
                {"detail": "Monthly message limit exceeded."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Incrementar contador
        usage.messages_used += 1
        usage.save()

        # Guardar mensaje
        message = serializer.save(chat=chat, role="user")

        # # ---- Llamar a Ollama con contexto del chat ----
        # import json
        # import urllib.request

        # Construir contexto: últimos 10 mensajes (incluye el que acabas de guardar)
        history = ChatMessage.objects.filter(chat=chat).order_by("-created_at")[:10]
        history = reversed(history)

        messages = [{"role": m.role, "content": m.content} for m in history]

        payload = {
            "model": "llama3.2:1b",  # o ponlo luego en settings/env
            "messages": messages,
            "stream": False,
        }

        req = urllib.request.Request(
            "http://ollama:11434/api/chat",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
        )

        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                out = json.loads(r.read().decode("utf-8"))
            assistant_text = out["message"]["content"]
        except Exception:
            assistant_text = "⚠️ Error generating response. Please try again."

        # Guardar respuesta del asistente
        assistant_msg = ChatMessage.objects.create(
            chat=chat,
            role="assistant",
            content=assistant_text
        )

        # Devolver ambos mensajes (user + assistant)
        return Response(
            {
                "user": ChatMessageSerializer(message).data,
                "assistant": ChatMessageSerializer(assistant_msg).data,
            },
            status=status.HTTP_201_CREATED
        )

        # return Response(
        #     ChatMessageSerializer(message).data,
        #     status=status.HTTP_201_CREATED
        # )