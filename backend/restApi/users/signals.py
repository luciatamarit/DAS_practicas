from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

from users.models import Usage  # ajusta si tu app se llama distinto

User = get_user_model()

@receiver(post_save, sender=User)
def create_usage(sender, instance, created, **kwargs):
    if created:
        Usage.objects.get_or_create(user=instance)