from rest_framework import serializers
from django.contrib.auth import get_user_model
from appointment.models import Appointment
import datetime

User = get_user_model()


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
            now = datetime.datetime.now()
            if value > now + datetime.timedelta(months=1):
                raise ValueError("You can't choose a date after a month from now.")
            if value < now:
                raise ValueError("You can't choose a date in the past.")
            if value.minute != 0 or value.minute != 30:
                raise ValueError("invalid minute")
            return value
        raise ValueError("invalid date")
