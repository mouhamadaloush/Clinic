from materials.views import MaterialsViewSet
from rest_framework import routers
from django.urls import path, include

router = routers.DefaultRouter(trailing_slash=True)
router.register("", MaterialsViewSet, basename="materials")

urlpatterns = [
    path("", include(router.urls)),
]
