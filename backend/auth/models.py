from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField
# Create your models here.

class User(AbstractUser):
    class GenderChoices(models.TextChoices):
        MALE = "M", "Male"
        FEMALE = "F", "Female"
        OTHER = "O", "Other"
    
    dob = models.DateField(verbose_name='date of birth', help_text='date of birth')
    phone = PhoneNumberField(region='SY')
    gender = models.CharField(choices=GenderChoices.choices)
    medical_history = models.TextField()
