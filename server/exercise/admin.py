from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Exercise)
admin.site.register(ExerciseMainPlan)
admin.site.register(ExerciseAddPlan)
admin.site.register(UserExerciseDone)
admin.site.register(UserDefaultUpperChestExercise)
admin.site.register(UserDefaultMiddleChestExercise)
admin.site.register(UserDefaultLowerChestExercise)
admin.site.register(UserDefaultBackExercise)
admin.site.register(UserDefaultFrontThighExercise)
admin.site.register(UserDefaultBackThighExercise)
admin.site.register(UserDefaultBicepsExercise)
admin.site.register(UserDefaultTricepsExercise)
admin.site.register(UserDefaultLateralDeltoidExercise)
admin.site.register(UserDefaultAnteriorDeltoidExercise)
admin.site.register(UserDefaultPosteriorDeltoidExercise)
admin.site.register(UserDefaultAbsExercise)