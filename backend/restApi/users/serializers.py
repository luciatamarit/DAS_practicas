from rest_framework import serializers
from .models import Usage


class UsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usage
        fields = ["messages_used", "messages_limit", "reset_date"]