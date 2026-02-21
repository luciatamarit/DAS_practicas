from django.urls import path
from .views import ChatListCreateView, ChatDetailView, SendMessageView
app_name = "chats"

urlpatterns = [
    path("", ChatListCreateView.as_view(), name="chat-list-create"),
    path("<int:pk>/", ChatDetailView.as_view(), name="chat-detail"),
    path("<int:chat_id>/messages/", SendMessageView.as_view(), name="send-message"),
]