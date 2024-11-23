from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone
###from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.
class CustomMananger(BaseUserManager):
    def create_user(self, password = None, **extra_fields):
            user = self.model(**extra_fields)
            if password:
                user.set_password(password)
            user.save(using=self._db)
            return user
    
    #  Create a superuser
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)
    
class User(AbstractUser):
    objects = CustomMananger()
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30, blank=True)
    gender = models.CharField(default='male', max_length=6)
    vegan = models.BooleanField(default=False)
    registered_allergy = models.BooleanField(default=False)
    exercise_main_plan_type = models.IntegerField(default=0)
    exercise_add_plan_type = models.IntegerField(default=0)
    exercise_main_plan_idx = models.IntegerField(default=0)
    exercise_add_plan_idx = models.IntegerField(default=0)
    chest_recent = models.BooleanField(default=False)
    calorie_bound = models.IntegerField(default = 0)
        
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    ###phonenumber = PhoneNumberField(unique=True, null=False, blank=False)

class UserBodyInfo(models.Model):
  user_id = models.OneToOneField(User, to_field = 'id', on_delete=models.CASCADE, primary_key=True)
  height = models.IntegerField(default = 0)
  duration = models.IntegerField(default = 0)
  goal = models.IntegerField(default = 0)

class UserWeight(models.Model):
  user_id = models.ForeignKey(User, to_field = 'id', on_delete=models.CASCADE)
  date = models.DateField(default = timezone.now)
  weight = models.DecimalField(max_digits=4, decimal_places=2, default = 0)
  
  class Meta:
    constraints = [
      models.UniqueConstraint(fields=['user_id', 'date'], name = 'unique_user_id_date_weight')
    ]   

class UserMuscle(models.Model):
  user_id = models.ForeignKey(User, to_field = 'id', on_delete=models.CASCADE)
  date = models.DateField(default = timezone.now)
  right_arm_muscle_mass = models.DecimalField(max_digits=4, decimal_places=2, default=0, null=False)
  left_arm_muscle_mass = models.DecimalField(max_digits=4, decimal_places=2, default=0, null=False)
  body_muscle_mass = models.DecimalField(max_digits=4, decimal_places=2, default=0, null=False)
  right_leg_muscle_mass = models.DecimalField(max_digits=4, decimal_places=2, default=0, null=False)
  left_leg_muscle_mass = models.DecimalField(max_digits=4, decimal_places=2, default=0, null=False)
  
  class Meta:
    constraints = [
      models.UniqueConstraint(fields=['user_id', 'date'], name = 'unique_user_id_date_muscle')
    ]

class UserFridgeImage(models.Model):
  user_id = models.OneToOneField(User, to_field = 'id', on_delete=models.CASCADE, primary_key=True)
  base64image = models.TextField()