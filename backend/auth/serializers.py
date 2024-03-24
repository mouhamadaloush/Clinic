from rest_framework import serializers
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model, password_validation
from django.contrib.auth.models import BaseUserManager

User = get_user_model()


class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=300, required=True)
    password = serializers.CharField(required=True, write_only=True)


class UserRegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "dob",
            "gender",
            "medical_hitory",
            "password",
        )

    def validate_email(self, value):
        user = User.objects.filter(email=value)
        if user:
            raise serializers.ValidationError("Email is already taken")
        return BaseUserManager.normalize_email(value)

    def validate_password(self, value):
        password_validation.validate_password(value)
        return value


class AuthUserSerializer(serializers.ModelSerializer):
    auth_token = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "dob",
            "gender",
            "medical_hitory",
            "is_active",
            "is_staff",
        )
        read_only_fields = ("id", "is_active", "is_staff")

    def get_auth_token(self, obj):
        token = Token.objects.create(user=obj)
        return token.key


class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_current_password(self, value):
        if not self.context["request"].user.check_password(value):
            raise serializers.ValidationError("Current password does not match")
        return value

    def validate_new_password(self, value):
        password_validation.validate_password(value)
        return value


class EmptySerializer(serializers.Serializer):
    pass


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "gender",
            "dob",
            "medical_history",
            "email",
            "phone",
            "password",
            "id",
        )
        extra_kwargs = {"password": {"write_only": True}}
