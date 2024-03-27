from django.contrib import admin
from .models import User, MedicalHistory
# Register your models here.
admin.site.register(User)
admin.site.register(MedicalHistory)
