from django.contrib.auth import get_user_model

User = get_user_model()
User.objects.all().delete()
User.save()
