from rest_framework.pagination import PageNumberPagination
from rest_framework import viewsets, permissions
from .models import Material
from .serializers import MaterialSerializer

class MaterialPagination(PageNumberPagination):
    page_size = 10  # Default page size
    page_size_query_param = 'page_size'  # Allows client to override
    max_page_size = 100  # Maximum limit client can request

class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    pagination_class = MaterialPagination  # Apply only to this ViewSet
    permission_classes = [permissions.IsAuthenticated]  # Adjust as needed