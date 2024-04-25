"""
created this,
depending on this tutorial:
https://medium.com/@therealak12/authenticate-using-email-instead-of-username-in-django-rest-framework-857645037bab#:~:text=Now%20let%E2%80%99s%20create%20an%20authentication%20backend%20for%20this%20user%2C%20add%20this%20file%20(auth_backends.py)%20in%20the%20users%20directory%3A

"""

from typing import Any
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.base_user import AbstractBaseUser
from django.http import HttpRequest


class EmailBackend(ModelBackend):
    def authenticate(self, request, **kwargs):
        UserModel = get_user_model()
        try:
            email = kwargs.get("email", None)
            if email is None:
                email = kwargs.get("username", None)
            user = UserModel.objects.get(email=email)
            if user.check_password(kwargs.get("password", None)):
                return user
        except UserModel.DoesNotExist:
            return None
        return None
