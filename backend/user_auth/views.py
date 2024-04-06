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
from knox.views import LoginView as  KnoxLoginView
from knox.auth import TokenAuthentication
from django.contrib.auth import login
# Create your views here.

User = get_user_model()


class AuthViewSet(viewsets.GenericViewSet):
    queryset = User.objects.all()

    permission_classes = [
        AllowAny,
    ]

    serializer_class = serializers.EmptySerializer
    serializer_classes = {
        #"login": serializers.UserLoginSerializer,
        "register": serializers.UserRegisterSerializer,
        "password_change": serializers.PasswordChangeSerializer,
    }



    '''@action(
        methods=[
            "POST",
        ],
        detail=False,
    )
    def login(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_and_authenticate_user(**serializer.validated_data)
        data = serializers.AuthUserSerializer(user).data
        return Response(data=data, status=status.HTTP_200_OK)'''



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
        return Response(data=data, status=status.HTTP_201_CREATED)



    '''@action(
        methods=[
            "POST",
        ],
        detail=False,
        permission_classes=[
            IsAuthenticated,
        ],
        authentication_classes=[
            TokenAuthentication,
        ],
    )
    def logout(self, request):
        Token.objects.filter(user=request.user).delete()
        data = {"success": "Sucessfully logged out"}
        return Response(data=data, status=status.HTTP_200_OK)'''



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
        return Response(status=status.HTTP_204_NO_CONTENT)



    def get_serializer_class(self):
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured("Serializer classes must be a dictionary")

        if self.action in self.serializer_classes.keys():
            return self.serializer_classes[self.action]

        return super().get_serializer_class()
    

#If the TokenAuthentication is your only default authentication class in REST_FRAMEWORK["DEFAULT_AUTHENTICATION_CLASSES"], remember to overwrite Knox’s LoginView, otherwise it’ll not work, since the login view will require an authentication token to generate a new token.
'''class LoginView(KnoxLoginView):
    serializer_class = serializers.UserLoginSerializer
    permission_classes = [AllowAny,]

    def post(self, request, format=None):
        serializer = serializers.UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_and_authenticate_user(**serializer.validated_data)
        login(request, user)#why does it need to use this django's login method
        return super(LoginView, self).post(request, format=None)'''

from knox.views import LoginView as KnoxLoginView
from rest_framework.authentication import BasicAuthentication

class LoginView(KnoxLoginView):
    authentication_classes = [BasicAuthentication]