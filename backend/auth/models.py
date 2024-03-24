from typing import Any
from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.


class User(AbstractUser):
    class GenderChoices(models.TextChoices):
        MALE = "M", "Male"
        FEMALE = "F", "Female"

    class MedicalHistory(models.TextField):
        last_edited = models.DateField(auto_now=True, verbose_name="last_edited")

        def __init__(self, *args: Any, **kwargs: Any) -> None:
            super().__init__(*args, **kwargs)

    email = models.EmailField("email address", unique=True)
    first_name = models.CharField("first name", max_length=255, null=False)
    last_name = models.CharField("last name", max_length=255, null=False)
    dob = models.DateField(verbose_name="date of birth", help_text="date of birth")
    phone = PhoneNumberField(region="SY")
    gender = models.CharField(choices=GenderChoices.choices)
    medical_history = MedicalHistory()

    username = None
    USERNAME_FIELD = "email"

    def __str__(self):
        return f"{self.username} - {self.first_name} - {self.last_name}"
