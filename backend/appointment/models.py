from django.db import models
from user_auth.models import User
from django.contrib.auth import get_user_model

# Create your models here.
User = get_user_model()


class Appointment(models.Model):
    """
    Represents an appointment made by a user.

    Attributes:
    - user: The user who booked the appointment.
    - chosen_date: The date and time of the appointment.
    - reason_of_appointment: The reason for the appointment.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    chosen_date = models.DateTimeField()
    reason_of_appointment = models.TextField(null=False, blank=False)

    def __str__(self):
        return f"{self.user}, {self.chosen_date}, {self.reason_of_appointment}"


class Record(models.Model):
    """
    Represents a medical record for an appointment.

    Attributes:
    - appointment: The appointment this record is associated with.
    - text_note: A textual note about the appointment.
    """
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE)
    text_note = models.TextField(blank=True)


class RecordImage(models.Model):
    """

    Represents an image associated with a medical record, including analysis.

    Attributes:
    - record: The medical record this image is associated with.
    - image: The base64-encoded image data.
    - mime_type: The MIME type of the image.
    - gemini_analysis: The analysis of the image from the Gemini API.
    """
    record = models.ForeignKey(Record, on_delete=models.CASCADE)
    image = models.TextField(blank=True)
    mime_type = models.CharField(max_length=50, default="png")
    # New field to store the analysis text received from the Gemini API
    gemini_analysis = models.TextField(blank=True, null=True)
