from django.db import models

# Create your models here.
class Material(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    quantity = models.FloatField()
    price = models.FloatField()


    def __str__(self):
        return f"{self.name} -description: {self.description} - quantity: {self.quantity} - price: {self.price}"
    