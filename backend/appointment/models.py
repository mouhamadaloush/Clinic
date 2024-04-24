from django.db import models
from user_auth.models import User
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta

# Create your models here. 
User  = get_user_model()

class Appointment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    chosen_date = models.DateTimeField()
    reason_of_appointment = models.TextField(null=False, blank=False)

        
    def __str__(self):
        return f"{self.user}, {self.chosen_date}, {self.reason_of_appointment}"