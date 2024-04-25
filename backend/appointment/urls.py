from rest_framework import routers
from .views import AppointmentViewSet
from django.urls import path, include


router = routers.DefaultRouter(trailing_slash=True)
router.register("", AppointmentViewSet, basename="appointent")

urlpatterns = [
    path("", include(router.urls)),
]
