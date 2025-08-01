from django.db import models
from user_auth.models import User
from django.contrib.auth import get_user_model

# Create your models here.
User = get_user_model()


class Appointment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    chosen_date = models.DateTimeField()
    reason_of_appointment = models.TextField(null=False, blank=False)

    def __str__(self):
        return f"{self.user}, {self.chosen_date}, {self.reason_of_appointment}"


class Record(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE)
    text_note = models.TextField(blank=True)


class RecordImage(models.Model):
    record = models.ForeignKey(Record, on_delete=models.CASCADE)
    image = models.TextField(blank=True)
    mime_type = models.CharField(max_length=100, blank=True, null=True)
    mime_type = models.CharField(max_length=50)
    # New field to store the analysis text received from the Gemini API
    gemini_analysis = models.TextField(blank=True, null=True)
