from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
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
    """this viewset is for doing stuff about or related to Appointment"""

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
        """make Appointment"""
        data = request.data
        data["user"] = (
            request.user.pk
        )  # get the user's pk to make Appointment instance.
        serializer = self.get_serializer(data=data)
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
        """get user done and schedueled appointments"""
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
        """get the unavailable dates so that you can exceclude them in the frontend app"""
        dates = Appointment.objects.filter(chosen_date__gt=now()).order_by(
            "chosen_date"
        )
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
        """delete an appointment"""
        delete_it = Appointment.objects.get(chosen_date=request.data["chosen_date"])
        delete_it.delete()
        return Response(
            {"message": "Deleted"},
            status=status.HTTP_200_OK,
        )

    @action(
        methods=[
            "DELETE",
        ],
        detail=False,
        permission_classes=[
            IsAuthenticated,
            IsAdminUser,
        ],
        authentication_classes=[
            TokenAuthentication,
        ],
    )
    def record(self, request):
        """take some notes about the examination and make"""
        serializer = serializers.RecordSerializer(data=request.data)
        serializer.is_valid(raise_exceptions=True)
        record = serializer.save()

        images = request.FILES.getlist("images")
        image_serializers = []
        for image in images:
            data = {
                "image": image,
                "record": record.pk,
            }
            serializer = serializers.ImageSerializer(data=data)
            serializer.is_valid(raise_exceptions=True)
            serializer.save()
            image_serializers.append(serializer)

            return Response(
                {
                    "property": serializer.data,
                    # Serialize each saved image
                    "images": [img.data for img in image_serializers],
                    "message": "It is saved successfully",
                    "status": status.HTTP_200_OK,
                }
            )

    def get_serializer_class(self):
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured("Serializer classes must be a dictionary")

        if self.action in self.serializer_classes.keys():
            return self.serializer_classes[self.action]

        return super().get_serializer_class()
