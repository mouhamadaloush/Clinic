from rest_framework import serializers
from materials.models import *


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = (
            "pk",
            "name",
            "description",
            "quantity",
            "price",
        )

    def validate_quantity(self, quantity):
        if quantity < 0:
            raise ValueError("invalid quantity less than zero!")
        return quantity

    def validate_price(self, price):
        if price < 0:
            raise ValueError("invalid price less than zero!")
        return price


class MaterialUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = (
            "quantity",
            "price",
        )

    def validate_quantity(self, quantity):
        if quantity < 0:
            raise ValueError("invalid quantity less than zero!")
        return quantity

    def validate_price(self, price):
        if price < 0:
            raise ValueError("invalid price less than zero!")
        return price