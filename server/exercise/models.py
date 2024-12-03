from django.db import models
from django.utils import timezone
from django.db.models.signals import post_migrate
from django.dispatch import receiver
import os, csv, ast

from account.models import *

# Create your models here.

class Exercise(models.Model):
  name = models.CharField(max_length=50, unique=True)
  muscle_part = models.CharField(max_length=30)
  sub_part = models.CharField(max_length=30, default="")
  calorie_male = models.IntegerField(default=0)
  calorie_female = models.IntegerField(default=0)
  setnum = models.IntegerField(default=5)
  default = models.BooleanField(default=False)

class ExerciseMainPlan(models.Model):
  type = models.IntegerField()
  day = models.IntegerField()
  muscle_part = models.CharField(max_length=30)
  
  class Meta:
    constraints = [
      models.UniqueConstraint(fields=['type', 'day'], name = 'unique_type_day_main_exercise')
    ]

@receiver(post_migrate)
def add_default_main_plan(sender, **kwargs):
  if not ExerciseMainPlan.objects.exists():
    ExerciseMainPlan.objects.create(type=0, day=1, muscle_part='body')
    ExerciseMainPlan.objects.create(type=0, day=2, muscle_part='legs')
    ExerciseMainPlan.objects.create(type=0, day=3, muscle_part='body')
    
    ExerciseMainPlan.objects.create(type=1, day=1, muscle_part='body')
    ExerciseMainPlan.objects.create(type=1, day=2, muscle_part='legs')
    
    ExerciseMainPlan.objects.create(type=2, day=1, muscle_part='legs')
    ExerciseMainPlan.objects.create(type=2, day=2, muscle_part='body')
    ExerciseMainPlan.objects.create(type=2, day=3, muscle_part='legs')
    ExerciseMainPlan.objects.create(type=2, day=4, muscle_part='body')
    ExerciseMainPlan.objects.create(type=2, day=5, muscle_part='legs')
    
    ExerciseMainPlan.objects.create(type=3, day=1, muscle_part='body')
    ExerciseMainPlan.objects.create(type=3, day=2, muscle_part='body')
    ExerciseMainPlan.objects.create(type=3, day=3, muscle_part='body')
    ExerciseMainPlan.objects.create(type=3, day=4, muscle_part='legs')
    
    ExerciseMainPlan.objects.create(type=4, day=1, muscle_part='body')
    ExerciseMainPlan.objects.create(type=4, day=2, muscle_part='body')
    ExerciseMainPlan.objects.create(type=4, day=3, muscle_part='body')
    ExerciseMainPlan.objects.create(type=4, day=4, muscle_part='body')
    ExerciseMainPlan.objects.create(type=4, day=5, muscle_part='legs')


class ExerciseAddPlan(models.Model):
  type = models.IntegerField()
  day = models.IntegerField()
  muscle_part = models.CharField(max_length=30)
  
  class Meta:
    constraints = [
      models.UniqueConstraint(fields=['type', 'day'], name = 'unique_type_day_add_exercise')
    ]

@receiver(post_migrate)
def add_default_add_plan(sender, **kwargs):
  if not ExerciseAddPlan.objects.exists():
    ExerciseAddPlan.objects.create(type=0, day=0, muscle_part='arms')
    ExerciseAddPlan.objects.create(type=0, day=1, muscle_part='shoulders')
    ExerciseAddPlan.objects.create(type=0, day=2, muscle_part='abs')
    
    ExerciseAddPlan.objects.create(type=1, day=0, muscle_part='arms')
    ExerciseAddPlan.objects.create(type=1, day=1, muscle_part='shoulders')
    ExerciseAddPlan.objects.create(type=1, day=2, muscle_part='arms')
    ExerciseAddPlan.objects.create(type=1, day=3, muscle_part='abs')

class UserDefaultExercise(models.Model):
  user_id = models.ForeignKey(User, to_field = 'id', on_delete=models.CASCADE)
  muscle_part = models.CharField(max_length=30)
  exercise_id = models.ForeignKey(Exercise, to_field = 'id', on_delete=models.CASCADE, default=1)
  
  class Meta:
    constraints = [
      models.UniqueConstraint(fields=['user_id', 'muscle_part'], name = 'unique_user_id_muscle_part_exercise')
    ]

class UserExerciseDone(models.Model):
  user_id = models.ForeignKey(User, to_field = 'id', on_delete=models.CASCADE)
  date_time = models.DateTimeField(default=timezone.now)
  exercise_id = models.ForeignKey(Exercise, to_field = 'id', on_delete=models.CASCADE, default=1)
  duration = models.IntegerField(default=60)
  
  class Meta:
    constraints = [
      models.UniqueConstraint(fields=['user_id', 'date_time'], name = 'unique_user_id_date_time_exercise')
    ]
    
@receiver(post_migrate)
def add_default_exercises(sender, **kwargs):
  if Exercise.objects.count() == 42:
    return
  else:
    Exercise.objects.all().delete()
  
  file_path = os.path.join(os.path.dirname(__file__), 'exercise.csv')
  with open(file_path, mode='r', encoding='utf-8-sig') as file:
    reader = csv.DictReader(file)
    for row in reader:
      print(row['name'])
      Exercise.objects.create(name=row['name'], muscle_part=row['muscle_part']
                              , sub_part=row['sub_part'], calorie_male=row['calorie_male']
                              , calorie_female=row['calorie_female'], setnum=row['setnum']
                              , default=row['default'])