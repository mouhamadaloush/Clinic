from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'first_name', 
            'last_name',
            'gender',
            'dob',
            'medical_history',
            'email',
            'phone',
            'password',
            'id',
        )
        extra_kwargs = {'password':{'write_only':True}}

