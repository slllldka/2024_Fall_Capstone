# Generated by Django 5.1.1 on 2024-10-31 01:42

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0008_alter_userexercise_date_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userexercise',
            name='date_time',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
