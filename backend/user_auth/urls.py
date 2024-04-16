from rest_framework import routers
from .views import AuthViewSet
from django.urls import path, include


router = routers.DefaultRouter(trailing_slash=True)
router.register("", AuthViewSet, basename="user_auth")

urlpatterns = [
    path("", include(router.urls)),
    path("", include("knox.urls")),
    path("verification/", include("verify_email.urls")),
]
