from django.contrib.auth import get_user_model
from django.core.exceptions import ImproperlyConfigured
from django.shortcuts import get_object_or_404
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMessage
#rest
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from knox.auth import TokenAuthentication
#application
from user_auth.utils import create_user_account
from user_auth import serializers
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
        "delete": serializers.AuthUserSerializer
    }

    def list(self, request):
        queryset = User.objects.filter(is_active=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(
        methods=[
            "DELETE",
        ],
        detail=False,
    )
    def delete(self,request):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, pk=request.data["pk"])
        serializer = self.get_serializer(user)
        serializer.delete()
        return Response(data={"message": "success"}, status=status.HTTP_200_OK)

    @action(
        methods=[
            "POST",
        ],
        detail=False,
    )
    def register(self, request):
        """this method is for user registration"""
        data = request.data #get the data from the request
        serializer = self.get_serializer(data=data) #get the suitable serializer for the data
        serializer.is_valid(raise_exception=True) #validate the data
        user = create_user_account(**serializer.validated_data) #create the user
        if "medical_history" in [key for key, value in data.items()]: #create the medical hisory if given
            mdata = request.data["medical_history"]
            serializer = serializers.MedicalHistorySerializer(data=mdata)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        #Note that we used here the default token generator from django library, according to django documentation
        confirmation_token = default_token_generator.make_token(user)
        actiavation_link = f"https://clinic-ashen.vercel.app/auth/activate/?user_id={user.id}&confirmation_token={confirmation_token}"
        subject = "Verify Email"
        message = f"Here is you activation link : {actiavation_link}"
        email = EmailMessage(subject, message, to=[user.email])
        try:
            email.send()
        except:
            user.delete()
            return Response(data={"message":"error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(data={"message": "success"}, status=status.HTTP_201_CREATED)

    @action(
        detail=False,
        methods=[
            "get",
        ],
    )

    def activate(self, request):
        """user activation"""
        user_id = request.query_params.get("user_id", "")
        confirmation_token = request.query_params.get("confirmation_token", "")
        print("Success")
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
        try:
            x=permission_classes[self.action]
            return ([x()])
        except:
            return([AllowAny()])
    

    def get_serializer_class(self):
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured("Serializer classes must be a dictionary")

        if self.action in self.serializer_classes.keys():
            return self.serializer_classes[self.action]

        return super().get_serializer_class()
