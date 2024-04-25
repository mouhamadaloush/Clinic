from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from appointment import serializers
from django.core.exceptions import ImproperlyConfigured
from rest_framework import status

from appointment.models import Appointment
from django.forms.models import model_to_dict
from knox.auth import TokenAuthentication

from django.utils.timezone import now
import datetime
from pytz import timezone

# Create your views here.

User = get_user_model()


class AppointmentViewSet(viewsets.GenericViewSet):
    queryset = User.objects.all()

    permission_classes = [
        AllowAny,
    ]

    serializer_class = serializers.EmptySerializer
    serializer_classes = {
        "make_appointment": serializers.AppointmentSerializer,
    }

    @action(
        methods=[
            "POST",
        ],
        detail=False,
        permission_classes=[
            IsAuthenticated,
        ],
        authentication_classes=[
            TokenAuthentication,
        ],
    )
    def make_appointment(self, request):
        data = request.data
        data["user"] = request.user.pk
        serializer = self.get_serializer(data=data)
        print(request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(data={"message": "success"}, status=status.HTTP_201_CREATED)

    @action(
        methods=[
            "GET",
        ],
        detail=False,
        permission_classes=[
            IsAuthenticated,
        ],
        authentication_classes=[
            TokenAuthentication,
        ],
    )
    def get_user_appointments(self, request):
        appointments = Appointment.objects.filter(user=request.user)
        serializer = serializers.AppointmentSerializer(appointments, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @action(
        methods=[
            "GET",
        ],
        detail=False,
        permission_classes=[
            IsAuthenticated,
        ],
        authentication_classes=[
            TokenAuthentication,
        ],
    )
    def get_unavailable_dates(self, request):
        current_date = now()
        objects_to_delete = Appointment.objects.filter(chosen_date__lt=current_date)
        objects_to_delete.delete()
        dates = Appointment.objects.all()
        serializer = serializers.UnavailableDates(dates, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
    @action(
        methods=[
            "DELETE",
        ],
        detail=False,
        permission_classes=[
            IsAuthenticated,
        ],
        authentication_classes=[
            TokenAuthentication,
        ],
    )
    def delete(self, request):
        delete_it = Appointment.objects.get(chosen_date=request.data["chosen_date"])
        delete_it.delete()
        return Response({"message": "Deleted"}, status= status.HTTP_200_OK)

    def get_serializer_class(self):
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured("Serializer classes must be a dictionary")

        if self.action in self.serializer_classes.keys():
            return self.serializer_classes[self.action]

        return super().get_serializer_class()
