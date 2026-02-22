from rest_framework import serializers
from .models import Chat, ChatMessage


class ChatSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)

    class Meta:
        model = Chat
        fields = ["id", "title", "created_at", "user_id"]
        read_only_fields = ["id", "created_at", "user_id"]


class ChatMessageSerializer(serializers.ModelSerializer):
    chat_id = serializers.IntegerField(source="chat.id", read_only=True)

    class Meta:
        model = ChatMessage
        fields = ["id", "role", "content", "chat_id"]
        read_only_fields = ["id", "chat_id"]

class ChatMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["content"]