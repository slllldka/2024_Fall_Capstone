from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone
###from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.
class CustomMananger(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('이메일은 필수입니다')
        user = self.model(email=self.normalize_email(email), **extra_fields)
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
    calorie_bound_num = models.IntegerField(default = 0)
        
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    ###phonenumber = PhoneNumberField(unique=True, null=False, blank=False)