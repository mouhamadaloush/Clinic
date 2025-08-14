from rest_framework import routers
from .views import AppointmentViewSet
from django.urls import path, include


router = routers.DefaultRouter(trailing_slash=True)
router.register("", AppointmentViewSet, basename="appointent")

urlpatterns = [
    # Includes all the URLs registered with the router for the AppointmentViewSet.
    # This provides endpoints for making appointments, viewing schedules, and managing records.
    path("", include(router.urls)),
]
