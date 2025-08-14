from rest_framework import serializers
from django.contrib.auth import get_user_model
from appointment.models import *
import datetime
from pytz import timezone

User = get_user_model()


class UnavailableDates(serializers.ModelSerializer):
    """
    Serializer for unavailable appointment dates.

    This serializer is used to represent the dates and times that are already
    booked for appointments.
    """
    class Meta:
        model = Appointment
        fields = ("chosen_date",)


class AppointmentSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and viewing appointments.

    This serializer handles the validation and serialization of appointment data.
    """
    class Meta:
        model = Appointment
        fields = (
            "id",
            "user",
            "chosen_date",
            "reason_of_appointment",
        )

    def validate_chosen_date(self, value):
        """
        Validate the chosen appointment date.

        This method ensures that the chosen date is within the allowed range
        (not in the past and not more than 30 days in the future) and that the
        time slot is available.

        Raises:
        - ValueError: If the date is invalid or the time slot is already booked.
        """
        now = datetime.datetime.now(tz=timezone("Asia/Damascus"))
        n = now + datetime.timedelta(days=30)
        n = n.astimezone(timezone("Asia/Damascus"))
        if value > (n):
            raise ValueError("You can't choose a date after a month from now.")
        if value < now:
            raise ValueError("You can't choose a date in the past.")
        if value.minute != 0 and value.minute != 30:
            raise ValueError("invalid minute")
        try:
            Appointment.objects.get(chosen_date=value)
        except Appointment.DoesNotExist:
            return value
        raise ValueError("invalid date")


class ImageSerializer(serializers.ModelSerializer):
    """
    Serializer for record images.

    This serializer handles the serialization of dental X-ray images, including
    the image data and the analysis from the Gemini API.
    """
    class Meta:
        model = RecordImage
        fields = '__all__' # This will automatically include 'gemini_analysis'


class RecordSerializer(serializers.ModelSerializer):
    """
    Serializer for medical records.

    This serializer handles the serialization of medical records, which include
    textual notes and are associated with an appointment.
    """
    class Meta:
        model = Record
        fields = (
            "appointment",
            "text_note",
        )


class EmptySerializer(serializers.Serializer):
    """
    An empty serializer.

    This serializer is used for actions that do not require any specific data
    to be serialized or deserialized.
    """
    pass
