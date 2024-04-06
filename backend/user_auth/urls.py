from rest_framework import routers
from .views import AuthViewSet
from django.urls import path, include
from user_auth.views import LoginView
from knox import views as knox_views

router = routers.DefaultRouter(trailing_slash=True)
router.register('', AuthViewSet, basename='user_auth')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='knox_login'),
    path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
]

