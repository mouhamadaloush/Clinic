from django.contrib.auth import get_user_model
from django.core.exceptions import ImproperlyConfigured
from django.shortcuts import get_object_or_404
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMessage
from django.db import transaction

# rest
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from knox.auth import TokenAuthentication

# application
from user_auth.utils import create_user_account
from user_auth import serializers

User = get_user_model()


class AuthViewSet(viewsets.GenericViewSet):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = serializers.EmptySerializer
    serializer_classes = {
        "register": serializers.UserRegisterSerializer,
        "password_change": serializers.PasswordChangeSerializer,
        "list": serializers.AuthUserSerializer,
        "retrieve": serializers.AuthUserSerializer,
        "delete": serializers.AuthUserSerializer,
    }

    def list(self, request):
        """
        List all active users.

        This endpoint retrieves a list of all users who are marked as active in the system.
        It is intended for administrative purposes to get an overview of the current users.

        Permissions:
        - User must be authenticated.
        """
        queryset = User.objects.filter(is_active=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """
        Retrieve a single user by their ID.

        This endpoint retrieves the details of a specific user identified by their primary key (ID).

        Permissions:
        - User must be authenticated.

        Path Parameters:
        - pk: The primary key of the user to retrieve.
        """
        user = get_object_or_404(self.get_queryset(), pk=pk)
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(methods=["DELETE"], detail=False)
    def delete(self, request):
        """
        Delete a user by their ID.

        This endpoint deletes a user from the system based on their primary key (ID).
        This is a permanent action and cannot be undone.

        Permissions:
        - User must be authenticated.

        Request Body:
        {
            "pk": <user_id>
        }
        """
        user = get_object_or_404(self.get_queryset(), pk=request.data.get("pk"))
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=["POST"], detail=False)
    def register(self, request):
        """
        Register a new user account.

        This endpoint handles new user registration. It creates a new user account,
        sends a verification email to the user's email address, and optionally
        creates a medical history record if provided.

        Request Body:
        {
            "email": "user@example.com",
            "first_name": "string",
            "last_name": "string",
            "phone": "string",
            "dob": "YYYY-MM-DD",
            "gender": "M" or "F",
            "is_staff": boolean,
            "password": "password",
            "medical_history": {
                "text": "string"
            }
        }
        """
        user_serializer = self.get_serializer(data=request.data)
        user_serializer.is_valid(raise_exception=True)

        medical_history_data = request.data.get("medical_history")
        mh_serializer = None
        if medical_history_data:
            mh_serializer = serializers.MedicalHistorySerializer(data=medical_history_data)
            mh_serializer.is_valid(raise_exception=True)

        try:
            with transaction.atomic():
                user = create_user_account(**user_serializer.validated_data)
                if mh_serializer:
                    mh_serializer.save(user=user)

            token = default_token_generator.make_token(user)
            activation_link = f"https://clinic-ashen.vercel.app/auth/activate/?user_id={user.id}&confirmation_token={token}"
            subject = "Verify Email"
            message = f"Here is your activation link: {activation_link}"
            email = EmailMessage(subject, message, to=[user.email])
            email.send(fail_silently=False)

        except Exception:
            # If user exists because transaction committed but email failed, delete user.
            if 'user' in locals() and user.pk:
                user.delete()
            return Response(
                {"message": "An error occurred during registration. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {"message": "Registration successful. Please check your email to activate your account."},
            status=status.HTTP_201_CREATED,
        )

    @action(methods=["GET"], detail=False)
    def activate(self, request):
        """
        Activate a user account.

        This endpoint is used to activate a user's account using the user ID and
        confirmation token sent to their email address upon registration.

        Query Parameters:
        - user_id: The ID of the user to activate.
        - confirmation_token: The token sent to the user's email.
        """
        user_id = request.query_params.get("user_id")
        token = request.query_params.get("confirmation_token")

        if not user_id or not token:
            return Response(
                {"message": "User ID and token are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = self.get_queryset().get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"message": "User not found."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response(
                {"message": "Token is invalid or expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.is_active:
            return Response({"message": "Account already activated."})

        user.is_active = True
        user.save()
        return Response({"message": "Email successfully confirmed. Your account is now active."})

    @action(
        methods=["POST"],
        detail=False,
        permission_classes=[IsAuthenticated],
        authentication_classes=[TokenAuthentication],
    )
    def password_change(self, request):
        """
        Change the user's password.

        This endpoint allows an authenticated user to change their password.
        The user must provide their current password and a new password.

        Permissions:
        - User must be authenticated.

        Request Body:
        {
            "current_password": "current_password",
            "new_password": "new_strong_password"
        }
        """
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()

        return Response({"message": "Password changed successfully."})

    def get_permissions(self):
        """
        Dynamically sets permissions based on the action.
        """
        permission_map = {
            "list": IsAuthenticated,
            "retrieve": IsAuthenticated,
            "delete": IsAuthenticated,
            "password_change": IsAuthenticated,
        }
        permission_class = permission_map.get(self.action, AllowAny)
        return [permission_class()]

    def get_serializer_class(self):
        """
        Dynamically sets the serializer class based on the action.
        """
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured("serializer_classes must be a dictionary")
        return self.serializer_classes.get(self.action, self.serializer_class)
