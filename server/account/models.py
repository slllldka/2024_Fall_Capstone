from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.
class CustomMananger(BaseUserManager):
    def create_user(self, password = None, **extra_fields):
        user = self.model(**extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

class User(AbstractUser):
    objects = CustomMananger()
    phonenumber = PhoneNumberField(unique=True, null=False, blank=False)
    
