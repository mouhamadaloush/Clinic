from rest_framework.pagination import PageNumberPagination
from rest_framework import viewsets, permissions
from .models import Material
from .serializers import MaterialSerializer

class MaterialsPagination(PageNumberPagination):
    """
    Custom pagination class for the materials list.
    
    Provides a consistent pagination scheme for the materials endpoint,
    allowing clients to request paged data.
    
    - `page_size`: The default number of items to return per page.
    - `page_size_query_param`: The URL query parameter clients can use to set the page size.
    - `max_page_size`: The maximum number of items a client can request in a single page.
    """
    page_size = 10  # Default page size
    page_size_query_param = 'page_size'  # Allows client to override
    max_page_size = 100  # Maximum limit client can request

class MaterialsViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing dental materials.

    This ViewSet provides a complete set of CRUD (Create, Retrieve, Update, Delete)
    operations for the `Material` model. It is restricted to authenticated users.

    The following actions are supported by default:
    - `list`: Retrieve a paginated list of all materials.
    - `create`: Add a new material to the inventory.
    - `retrieve`: Get the details of a specific material by its ID.
    - `update`: Fully update an existing material.
    - `partial_update`: Partially update an existing material.
    - `destroy`: Delete a material from the inventory.

    Permissions:
    - Requires the user to be authenticated.

    Pagination:
    - Uses the `MaterialsPagination` class to paginate the list results.

    Request Body for `create` and `update`:
    {
        "name": "string",
        "description": "string (optional)",
        "quantity": number (float),
        "price": number (float)
    }
    """
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    pagination_class = MaterialsPagination  # Apply only to this ViewSet
    permission_classes = [permissions.IsAuthenticated]  # Adjust as needed
