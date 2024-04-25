from rest_framework import serializers
from django.contrib.auth import get_user_model
from appointment.models import Appointment
import datetime
from pytz import timezone

User = get_user_model()


class UnavailableDates(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ("chosen_date",)


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = (
            "user",
            "chosen_date",
            "reason_of_appointment",
        )

    def validate_chosen_date(self, value):
        try:
            Appointment.objects.get(chosen_date=value)
        except Appointment.DoesNotExist:
            now = datetime.datetime.now(tz=timezone("UTC"))
            n = now + datetime.timedelta(days=30)
            n = n.astimezone(timezone("UTC"))
            if value > (n):
                raise ValueError("You can't choose a date after a month from now.")
            if value < now:
                raise ValueError("You can't choose a date in the past.")
            if value.minute != 0 and value.minute != 30:
                raise ValueError("invalid minute")
            return value
        raise ValueError("invalid date")


class EmptySerializer(serializers.Serializer):
    pass
