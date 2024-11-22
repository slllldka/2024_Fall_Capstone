from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Exercise)
admin.site.register(ExerciseMainPlan)
admin.site.register(ExerciseAddPlan)
admin.site.register(UserExerciseDone)
admin.site.register(UserDefaultExercise)