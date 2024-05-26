from materials.models import Material
from materials.serializers import MaterialSerializer, MaterialUpdateSerializer
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet

# Create your views here.


class MaterialsAPIView(GenericViewSet, RetrieveUpdateDestroyAPIView, ListCreateAPIView):
    queryset = Material.objects.all()
    permission_classes = [IsAdminUser,IsAuthenticated,]

    def get_serializer_class(self):
        if self.request.method in ["GET", "POST", "DELETE"]:
            return MaterialSerializer
        elif self.request.method in ["PUT", "PATCH"]:
            return MaterialUpdateSerializer
        return super().get_serializer_class()
