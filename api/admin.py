from django.contrib import admin
from .models import Department, Student, Lecturer, Course, Registration, Result

# Register your models here.
admin.site.register(Department)
admin.site.register(Student)
admin.site.register(Lecturer)
admin.site.register(Course)
admin.site.register(Registration)
admin.site.register(Result)