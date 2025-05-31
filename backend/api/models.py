from django.db import models

# Create your models here.
# TEST
class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
## TEST ENDE