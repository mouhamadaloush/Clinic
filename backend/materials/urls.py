from materials.views import MaterialsAPIView
from rest_framework import routers
from django.urls import path, include

router = routers.DefaultRouter(trailing_slash=True)
router.register("", MaterialsAPIView, basename="materials")

urlpatterns = [
    path("", include(router.urls)),
]
