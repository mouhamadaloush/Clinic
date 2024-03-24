from rest_framework import serializers
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

User = get_user_model()

class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=300, required=True)
    password = serializers.CharField(required=True, write_only=True)


class AuthUserSerializer(serializers.Serializer):
    auth_token = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id','email', 'first_name', 'last_name', 'phone', 'dob', 'gender', 'medical_hitory', 'is_active', 'is_staff')
        read_only_fields = ('id', 'is_active', 'is_staff')

    def get_auth_token(self, obj):
        token = Token.objects.create(user=obj)
        return token.key


class EmptySerializer(serializers.Serializer):
    pass


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

