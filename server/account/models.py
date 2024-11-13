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
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    ###phonenumber = PhoneNumberField(unique=True, null=False, blank=False)

class UserBodyInfo(models.Model):
  user_id = models.OneToOneField(User, to_field = 'id', on_delete=models.CASCADE, primary_key=True)
  height = models.IntegerField()
  weight = models.DecimalField(max_digits=4, decimal_places=2)
  right_arm_muscle_mass = models.DecimalField(max_digits=4, decimal_places=2)
  left_arm_muscle_mass = models.DecimalField(max_digits=4, decimal_places=2)
  body_muscle_mass = models.DecimalField(max_digits=4, decimal_places=2)
  right_leg_muscle_mass = models.DecimalField(max_digits=4, decimal_places=2)
  left_leg_muscle_mass = models.DecimalField(max_digits=4, decimal_places=2)
  weight_goal = models.IntegerField()
  period_goal = models.DateField(default=timezone.now)
  muscle_goal = models.IntegerField()
  duration = models.IntegerField()

class UserFridgeImage(models.Model):
  user_id = models.OneToOneField(User, to_field = 'id', on_delete=models.CASCADE, primary_key=True)
  base64image = models.TextField()