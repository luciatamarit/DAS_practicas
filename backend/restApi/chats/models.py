from django.db import models
from django.conf import settings

from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta


class Chat(models.Model):
    title = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="chats",
    )

    def __str__(self):
        return self.title


class ChatMessage(models.Model):
    ROLE_CHOICES = [
        ("system", "system"),
        ("user", "user"),
    ]

    chat = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
        related_name="messages",
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.role}: {self.content[:30]}"
    

User = get_user_model()

class Usage(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    messages_used = models.IntegerField(default=0)
    messages_limit = models.IntegerField(default=50)
    reset_date = models.DateField(default=timezone.now)

    def reset_month_if_needed(self):
        today = timezone.now().date()
        if self.reset_date < today:
            self.messages_used = 0
            self.reset_date = today + timedelta(days=30)
            self.save()