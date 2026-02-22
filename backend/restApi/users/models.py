
from django.conf import settings
from django.db import models
from django.utils import timezone


class Usage(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="usage",
    )
    messages_used = models.IntegerField(default=0)
    messages_limit = models.IntegerField(default=100)
    reset_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Usage(user_id={self.user_id}, used={self.messages_used}/{self.messages_limit})"