from rest_framework import serializers
from .models import Material

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = ['id', 'name', 'description', 'quantity', 'price']
        read_only_fields = ['id']  # ID is auto-generated and shouldn't be modified

    def validate_quantity(self, quantity):
        if quantity < 0:
            raise ValueError("invalid quantity less than zero!")
        return quantity

    def validate_price(self, price):
        if price < 0:
            raise ValueError("invalid price less than zero!")
        return price

