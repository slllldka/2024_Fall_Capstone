# Generated by Django 5.1.1 on 2024-10-31 01:41

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0007_userbodyinfo_userfridgeimage_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userexercise',
            name='date_time',
            field=models.DateTimeField(default=datetime.datetime(2024, 10, 31, 1, 41, 33, 937453, tzinfo=datetime.timezone.utc)),
        ),
    ]
