from django.shortcuts import render

from django.contrib.auth import get_user_model, logout
from django.core.exceptions import ImproperlyConfigured
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from . import serializers
from .utils import get_and_authenticate_user, create_user_account

from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from knox.auth import TokenAuthentication
from django.contrib.auth import login

from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMessage

# Create your views here.

User = get_user_model()


class AuthViewSet(viewsets.GenericViewSet):
    queryset = User.objects.all()

    permission_classes = [
        AllowAny,
    ]

    serializer_class = serializers.EmptySerializer
    serializer_classes = {
        # "login": serializers.UserLoginSerializer,
        "register": serializers.UserRegisterSerializer,
        "password_change": serializers.PasswordChangeSerializer,
    }

    @action(
        methods=[
            "POST",
        ],
        detail=False,
    )
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = create_user_account(**serializer.validated_data)
        data = serializers.AuthUserSerializer(user).data
        confirmation_token = default_token_generator.make_token(user)
        actiavation_link = f"https://clinic-ashen.vercel.app/auth/activate/?user_id={user.id}&confirmation_token={confirmation_token}/"
        subject = "Verify Email"
        message = f"Here is you activation link : {actiavation_link}"
        email = EmailMessage(subject, message, to=[user.email])
        email.send()
        return Response(data=data, status=status.HTTP_201_CREATED)

    @action(
        detail=False,
        permission_classes=[
            AllowAny,
        ],
        methods=[
            "get",
        ],
    )
    def activate(self, request, pk=None):
        user_id = request.query_params.get("user_id", "")
        confirmation_token = request.query_params.get("confirmation_token", "")
        try:
            user = self.get_queryset().get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is None:
            return Response("User not found", status=status.HTTP_400_BAD_REQUEST)
        if not default_token_generator.check_token(user, confirmation_token):
            return Response(
                "Token is invalid or expired. Please request another confirmation email by signing in.",
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.is_active = True
        user.save()
        return Response(
            data={"message": "Email successfully confirmed"},
            status=status.HTTP_200_OK,
        )

    @action(
        methods=["POST"],
        detail=False,
        permission_classes=[
            IsAuthenticated,
        ],
        authentication_classes=[
            TokenAuthentication,
        ],
    )
    def password_change(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()
        return Response(
            data={"message": "Password changed successfuly!"}, status=status.HTTP_200_OK
        )

    def get_serializer_class(self):
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured("Serializer classes must be a dictionary")

        if self.action in self.serializer_classes.keys():
            return self.serializer_classes[self.action]

        return super().get_serializer_class()
