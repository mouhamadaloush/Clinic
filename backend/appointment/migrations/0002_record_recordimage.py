# Generated by Django 5.0.3 on 2024-05-14 13:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointment', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Record',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text_note', models.TextField(blank=True)),
                ('appointment', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='appointment.appointment')),
            ],
        ),
        migrations.CreateModel(
            name='RecordImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='')),
                ('record', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='appointment.record')),
            ],
        ),
    ]
