from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Usage
import re

User = get_user_model() ## MI MODELO DE USUARIO DE DJANGO

class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=False, allow_blank=False)
    password2 = serializers.CharField(write_only=True, required=False, allow_blank=False)
    class Meta:
        model = User
        fields = ("username", "email", "password", "password1", "password2")
        extra_kwargs = {
            "password": {"write_only": True, "required": False, "allow_blank": False},
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if not value or "@" not in value:
            raise serializers.ValidationError("Invalid email format.")
        return value

    def _validate_password_rules(self, pwd: str) -> None:
        if len(pwd) <= 8:
            raise serializers.ValidationError({"password": "Password must be longer than 8 characters."})
        if not re.search(r"[A-Z]", pwd):
            raise serializers.ValidationError({"password": "Password must include at least one uppercase letter."})
        if not re.search(r"[a-z]", pwd):
            raise serializers.ValidationError({"password": "Password must include at least one lowercase letter."})

    def validate(self, attrs):
        ## ACEPTO DOS OPCIONES O P1 Y P2 O SOLO P 

        ## EN REALIDAD SIEMPRE SIGO LA LOGIA DE P1 Y P2 PORQUE ES LO QUE ME MUESTRA MI PAGINA DE LOGIN
        p = attrs.get("password")
        p1 = attrs.get("password1")
        p2 = attrs.get("password2")

        if p1 is not None or p2 is not None:
            if not p1 or not p2:
                raise serializers.ValidationError({"password2": "Both password1 and password2 are required."})
            if p1 != p2:
                raise serializers.ValidationError({"password2": "Passwords do not match."})

            self._validate_password_rules(p1)
            attrs["password"] = p1
            return attrs

        if not p:
            raise serializers.ValidationError({"password": "Password is required."})

        self._validate_password_rules(p)
        return attrs

    def create(self, validated_data):
        validated_data.pop("password1", None)
        validated_data.pop("password2", None)

        password = validated_data.pop("password")
        ## HAGO CREATE_USER PORQUE ESO CREA Y GUARDO
        ##  Y SEPARO LA CONTRASEÑA PARA CIFRARLA
        user = User.objects.create_user(**validated_data, password=password)
        ## ESTO CREA UN USUARIO EN LA BASE DE DATOS 
        return user
    
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class ChangePasswordSerializer(serializers.Serializer):
    ## RECIBO LAS DOS CONTRASEÑAS Y VALIDO QUE LA SEGUNDA SIGA MIS RESTRICCIONES
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
    ## ESTOY CAMBIANDO EL NOMBRE DE USER A USER_ID QUE GUARDA EL ID DEL USUARIO 
    
    class Meta:
        model = Usage
        fields = ["id", "user_id", "messages_used", "messages_limit", "reset_date"]
        ## ID ES EL ID DEL MODELO USAGE
        ## USER_ID ES EL ID DEL MODELO USER