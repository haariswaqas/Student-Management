# Generated by Django 4.1.3 on 2023-10-01 00:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_registration'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='registration',
            unique_together={('student', 'course')},
        ),
        migrations.CreateModel(
            name='Result',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.FloatField(default=0, null=True)),
                ('grade', models.CharField(default='TBD', max_length=10, null=True)),
                ('grade_point', models.FloatField(default=0, null=True)),
                ('gpt', models.FloatField(default=0, null=True)),
                ('cgpa', models.DecimalField(blank=True, decimal_places=2, max_digits=3, null=True)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.course')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.student')),
            ],
            options={
                'unique_together': {('student', 'course')},
            },
        ),
    ]
