from typing import Any
from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.
from .managers import UserManager


class MedicalHistory(models.Model):
    text = models.TextField()
    last_modified = models.DateField(auto_now=True, verbose_name="last_modified")

    
class User(AbstractUser):

    class GenderChoices(models.TextChoices):
        MALE = "M", "male"
        FEMALE = "F", "female"


    email = models.EmailField("email address", unique=True)
    first_name = models.CharField("first name", max_length=255, default='')
    last_name = models.CharField("last name", max_length=255, default='')
    dob = models.DateField(auto_now_add=True)
    phone = PhoneNumberField(region="SY")
    gender = models.CharField(choices=GenderChoices.choices, max_length=20)
    medical_history = models.OneToOneField(MedicalHistory, on_delete=models.CASCADE)

    username = None
    objects = UserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.username} - {self.first_name} - {self.last_name}"
