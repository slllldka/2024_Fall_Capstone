from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Allergy)
admin.site.register(UserAllergy)
admin.site.register(Food)
admin.site.register(Ingredient)
admin.site.register(IngredientInFood)
admin.site.register(FoodKeyword)
admin.site.register(SelectedFood)
admin.site.register(FiveDayCalorie)