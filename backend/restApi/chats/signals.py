from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from users.models import Usage

User = get_user_model()


@receiver(post_save, sender=User)
def create_usage(sender, instance, created, **kwargs):
    if created:
        Usage.objects.create(
            user=instance,
            messages_limit=50,
            reset_date=timezone.now() + timedelta(days=30)
        )