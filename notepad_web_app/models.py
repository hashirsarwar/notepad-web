from django.db import models

class User(models.Model):
    uid = models.CharField(max_length=200, primary_key=True)
    name = models.CharField(max_length=200)

class Document(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField()
