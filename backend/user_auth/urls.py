from rest_framework import routers
from .views import AuthViewSet
from django.urls import path, include


router = routers.DefaultRouter(trailing_slash=True)
router.register("", AuthViewSet, basename="user_auth")

from knox import views as knox_views
from . import views

urlpatterns = [
    path("login/", views.LoginView.as_view(), name="knox_login"),
    path("logout/", knox_views.LogoutView.as_view(), name="knox_logout"),
    path("logoutall/", knox_views.LogoutAllView.as_view(), name="knox_logoutall"),
    path("", include(router.urls)),
    path("activate/<int:user_id>&<confirmation_token>/", views.AuthViewSet.as_view({'get': 'activate'}), name='activate'),
]
