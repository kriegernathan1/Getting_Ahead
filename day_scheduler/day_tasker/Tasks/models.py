from django.db import models
from django.contrib.auth.models import User, AnonymousUser
from django.conf import settings 

# class Lead(models.Model):
#     name = models.CharField(max_length=100)
#     email = models.EmailField(max_length=254, unique=True)
#     message = models.CharField(max_length=500, blank=True)
#     created_at = models.DateField(auto_now=True) 

class Task(models.Model):
    # name of task 
    # length of task
    # importance 
    # life area
    #key (for react)
    #showInToday (boolean)
    # created time

    IMPORTANCE_CHOICES = (
        ("Not Important Not Urgent", "Not Important Not Urgent"),
        ("Urgent but Not Important", "Urgent but Not Important"),
        ("Important but Not Urgent", "Important but Not Urgent"),
        ("Important and Urgent", "Important and Urgent"),
    )

    LIFE_AREA_CHOICES = (
        ("Personal", "Personal"),
        ("Family", "Family"),
        ("Career", "Career"),
        ("Hobby", "Hobby"),
    )

    name = models.CharField(max_length=50)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="user", on_delete=models.CASCADE, default=1)
    time = models.CharField(max_length=8, default="")
    importance = models.CharField(max_length=50, choices = IMPORTANCE_CHOICES)
    lifeArea = models.CharField(max_length=20, choices=LIFE_AREA_CHOICES)
    key = models.BigIntegerField()
    showInToday = models.BooleanField()
    completed = models.BooleanField(default=False)
    created_at = models.DateField(auto_now=True) 