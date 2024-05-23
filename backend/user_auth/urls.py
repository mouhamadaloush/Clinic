from rest_framework import routers
from .views import AuthViewSet
from django.urls import path, include


router = routers.DefaultRouter(trailing_slash=True)
router.register("", AuthViewSet, basename="user_auth")

urlpatterns = [
    path("", include("knox.urls")),
    path("", include(router.urls)),
    path("activate/<int:user_id>&<confirmation_token>/", AuthViewSet.activate),
    #path("verification/", include("verify_email.urls")),
]
