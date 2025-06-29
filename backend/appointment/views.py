from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from appointment import serializers
from django.core.exceptions import ImproperlyConfigured
from rest_framework import status

from appointment.models import Appointment, Record, RecordImage
from django.forms.models import model_to_dict
from knox.auth import TokenAuthentication
from collections import defaultdict

from pytz import timezone
from django.utils.timezone import now
import datetime
from django.core.mail import EmailMessage

from django.core.files.uploadedfile import InMemoryUploadedFile
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
        app = serializer.save()
        return Response(data={"appointment_id": app.pk}, status=status.HTTP_201_CREATED)

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
        data = defaultdict(list)
        now = datetime.datetime.now(tz=timezone("Asia/Damascus"))
        appointments = Appointment.objects.filter(user=request.user).order_by(
            "chosen_date"
        )
        serializer = serializers.AppointmentSerializer(appointments, many=True)
        for appointment in serializer.data:
            print(appointment["chosen_date"])
            date = str(appointment["chosen_date"]).split("T")[
                0
            ]  # Extract the date part
            time = str(appointment["chosen_date"]).split("T")[
                1
            ]  # .split("+")[0]  # Extract the time part
            appointment["time"] = time
            del appointment["chosen_date"]
            data[date].append(appointment)

        data = dict(data)
        return Response(data=data, status=status.HTTP_200_OK)
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
        data = defaultdict(list)
        now = datetime.datetime.now(tz=timezone("Asia/Damascus"))
        appointments = Appointment.objects.filter(chosen_date__gte=now)
        serializer = serializers.AppointmentSerializer(appointments, many=True)
        for appointment in serializer.data:
            print(appointment["chosen_date"])
            date = str(appointment["chosen_date"]).split("T")[
                0
            ]  # Extract the date part
            time = str(appointment["chosen_date"]).split("T")[
                1
            ]  # .split("+")[0]  # Extract the time part
            data[date].append(time)
        data = dict(data)
        return Response(data=data, status=status.HTTP_200_OK)

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
    def list_appointments(self, request):
        data = defaultdict(list)
        now = datetime.datetime.now(tz=timezone("Asia/Damascus"))
        appointments = Appointment.objects.filter(chosen_date__gte=now).order_by(
            "chosen_date"
        )
        serializer = serializers.AppointmentSerializer(appointments, many=True)
        for appointment in serializer.data:
            print(appointment["chosen_date"])
            date = str(appointment["chosen_date"]).split("T")[
                0
            ]  # Extract the date part
            time = str(appointment["chosen_date"]).split("T")[
                1
            ]  # .split("+")[0]  # Extract the time part
            appointment["time"] = time
            del appointment["chosen_date"]
            data[date].append(appointment)

        data = dict(data)
        return Response(data=data, status=status.HTTP_200_OK)

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
        delete_it = Appointment.objects.get(pk=request.query_params.get("id"))
        if request.user.is_staff:
            patient = delete_it.user
            user_name = patient.first_name + " " + patient.last_name
            date = delete_it.chosen_date
            subject = "your appointment has been canceled!"
            message = f"Dear {user_name},\nI hope this message finds you well. I am writing to express my sincerest apologies for the inconvenience caused by the cancellation of your dental appointment scheduled for [{date}]. \nRegrettably, unforeseen circumstances have arisen that necessitate the rescheduling of appointments. While we always strive to maintain our schedule, occasionally, situations beyond our control arise, and we must adjust accordingly."
            email = EmailMessage(subject, message, to=[patient.email])
            email.send()
        delete_it.delete()
        return Response({"message": "Deleted"}, status=status.HTTP_200_OK)

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
    def record(self, request):
        """take some notes about the examination and make"""
        if request.user.is_staff:
            print(request.data)
            rec_serializer = serializers.RecordSerializer(data=request.data)
            rec_serializer.is_valid(raise_exception=True)
            record = rec_serializer.save()

            images = request.data["images"]
            image_serializers = []
            for image in images:
                data = {
                    "mime_type": image["mime_type"],
                    "image": image["encoded_data"],
                    "record": record.pk,
                }
                print(image)
                serializer = serializers.ImageSerializer(data=data)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                image_serializers.append(serializer)

            return Response(
                {
                    "record": rec_serializer.data,
                    # Serialize each saved image
                    "images": [img.data for img in image_serializers],
                    "message": "It is saved successfully",
                    "status": status.HTTP_200_OK,
                }
            )
        else:
            print(request.user.is_staff)
            return Response(
                data={"message": "You are not allowed to do this operation"},
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )

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
    def get_record(self, request):
        "Get the record of an appointment"
        pk = request.query_params.get("appointment_id", "")
        data = {}
        try:
            record = Record.objects.get(appointment=pk)
            rec_serializer = serializers.RecordSerializer(record)
            data["record"] = rec_serializer.data
        except Record.DoesNotExist:
            data["record"] = "None"


        images = RecordImage.objects.filter(record=record)
        im_serializer = serializers.ImageSerializer(images, many=True)
        data["images"] = im_serializer.data
        return Response(data, status=status.HTTP_200_OK)

    def get_serializer_class(self):
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured("Serializer classes must be a dictionary")

        if self.action in self.serializer_classes.keys():
            return self.serializer_classes[self.action]

        return super().get_serializer_class()
