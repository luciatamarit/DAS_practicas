from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Usage
import re

User = get_user_model()



class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ("username", "email", "password")
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate(self, attrs):
        password = attrs.get("password")

        if len(password) <= 8:
            raise serializers.ValidationError(
                {"password": "Password must be longer than 8 characters."}
            )

        
        if not re.search(r"[A-Z]", password):
            raise serializers.ValidationError(
                {"password": "Password must include at least one uppercase letter."}
            )

        if not re.search(r"[a-z]", password):
            raise serializers.ValidationError(
                {"password": "Password must include at least one lowercase letter."}
            )

        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()

    def validate_new_password(self, value):
        if len(value) <= 8:
            raise serializers.ValidationError(
                "Password must be longer than 8 characters."
            )

        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError(
                "Password must include at least one uppercase letter."
            )

        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError(
                "Password must include at least one lowercase letter."
            )

        return value


class UsageSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)

    class Meta:
        model = Usage
        fields = ["id", "user_id", "messages_used", "messages_limit", "reset_date"]