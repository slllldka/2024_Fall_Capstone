# Generated by Django 5.1.1 on 2024-11-19 16:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0013_user_registered_allergy_userbodyinfo_period_goal_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userbodyinfo',
            name='body_muscle_mass',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=4),
        ),
        migrations.AlterField(
            model_name='userbodyinfo',
            name='left_arm_muscle_mass',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=4),
        ),
        migrations.AlterField(
            model_name='userbodyinfo',
            name='left_leg_muscle_mass',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=4),
        ),
        migrations.AlterField(
            model_name='userbodyinfo',
            name='muscle_goal',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='userbodyinfo',
            name='right_arm_muscle_mass',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=4),
        ),
        migrations.AlterField(
            model_name='userbodyinfo',
            name='right_leg_muscle_mass',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=4),
        ),
    ]