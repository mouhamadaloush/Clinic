from django.contrib.auth import get_user_model
from django.core.exceptions import ImproperlyConfigured
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from . import serializers
from .utils import create_user_account
from rest_framework import generics
from knox.auth import TokenAuthentication
from django.contrib.auth import login
from django.shortcuts import get_object_or_404

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
        "list": serializers.AuthUserSerializer,
        "retrieve": serializers.AuthUserSerializer,
    }

    def list(self, request):
        queryset = User.objects.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = self.get_serializer(user)
        return Response(serializer.data)


    @action(
        methods=[
            "POST",
        ],
        detail=False,
    )
    def register(self, request):
        data = request.data
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = create_user_account(**serializer.validated_data)
        if "medical_history" in [key for key, value in data.items()]:
            mdata = request.data["medical_history"]
            serializer = serializers.MedicalHistorySerializer(data=mdata)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        confirmation_token = default_token_generator.make_token(user)
        actiavation_link = f"https://clinic-ashen.vercel.app/auth/activate/?user_id={user.id}&confirmation_token={confirmation_token}/"
        subject = "Verify Email"
        message = f"Here is you activation link : {actiavation_link}"
        email = EmailMessage(subject, message, to=[user.email])
        email.send()
        return Response(data={"message": "success"}, status=status.HTTP_201_CREATED)

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
        confirmation_token = request.query_params.get("confirmation_token", "")[0:-1:1]
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


    def get_permissions(self):
        permission_classes = {
            "list": IsAuthenticated,
            "register": AllowAny,
            "activate": AllowAny,
            "password_change": IsAuthenticated,
            "retrieve": IsAuthenticated,
        }
        print(f"*****{self.action}******")
        return ([permission_classes[self.action]()])
    

    def get_serializer_class(self):
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured("Serializer classes must be a dictionary")

        if self.action in self.serializer_classes.keys():
            return self.serializer_classes[self.action]

        return super().get_serializer_class()
