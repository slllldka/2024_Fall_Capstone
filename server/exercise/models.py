from django.db import models
from django.utils import timezone

from account.models import *

# Create your models here.

class Exercise(models.Model):
  name = models.CharField(max_length=30, unique=True)
  muscle_part = models.CharField(max_length=30)
  calorie = models.IntegerField()
  setnum = models.IntegerField()

class UserExercise(models.Model):
  user_id = models.ForeignKey(User, to_field = 'id', on_delete=models.CASCADE)
  date_time = models.DateTimeField(default=timezone.now)
  exercise_id = models.ForeignKey(Exercise, to_field = 'id', on_delete=models.CASCADE, default=1)
  duration = models.IntegerField(default=60)
  
  class Meta:
      constraints = [
          models.UniqueConstraint(fields=['user_id', 'date_time'], name = 'unique_user_id_date_time_exercise')
      ]