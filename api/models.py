from django.db import models
from datetime import *

# Create your models here.

class Department(models.Model):
    name = models.CharField(max_length = 300) 
    code = models.CharField(max_length = 5)
    description = models.TextField(default ="Description")
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self): 
        return f"{self.name} ({self.code}) added on {self.created}"


class Student(models.Model):
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, null=True, blank = True)
    last_name = models.CharField(max_length=50)
    student_id = models.CharField(max_length = 10)
    gender = models.CharField(max_length=10)
    date_of_birth = models.DateField(null=True, blank = True)
    profile_pic = models.CharField(max_length = 10000, default='Profile Picture Set', null = True, blank = True)
    age = models.IntegerField(null=True, blank = True)
    shs = models.CharField(max_length = 200, null=True, blank = True)
    bio = models.TextField(max_length=10000000, blank = True, null = True)
    department = models.ForeignKey(Department, on_delete = models.CASCADE, default = 'CPEN')
    admission_year = models.IntegerField(default = 2022)
    level = models.CharField(max_length = 12, default = '300', null = True, blank = True)
    semester = models.CharField(max_length=6, default = '1')
    email = models.EmailField(default = 'student@ug.gh')
    phone_number = models.CharField(max_length=20, null=True, blank = True)
  

    def __str__(self):
        return f'{self.first_name} {self.last_name} - {self.student_id}'

    def save(self, *args, **kwargs):
        try:
            dob = datetime.strptime(str(self.date_of_birth), '%Y-%m-%d').date()
            today = datetime.now().date()
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            self.age = age
        except (ValueError, TypeError):
            self.age = None

    

        if self.middle_name and len(self.middle_name) > 0:
            middle_initial = self.middle_name[0].lower()
        else:
            middle_initial = ''

        self.email = f'{self.first_name[0].lower()}{middle_initial}.{self.last_name.lower()}{str(self.student_id)[5:8]}@st.ug.edu.gh'

          
        if self.gender == "Male": 
            self.profile_pic = 'https://cdn5.vectorstock.com/i/1000x1000/52/54/male-student-graduation-avatar-profile-vector-12055254.jpg'
        elif self.gender == "Female":
            self.profile_pic = 'https://cdn1.vectorstock.com/i/1000x1000/52/65/female-student-graduation-avatar-profile-vector-12055265.jpg'
        admission_year = None
        if self.level == '400':
            admission_year = 2021
           
        elif self.level == '300':
            admission_year = 2022
            
        elif self.level == '200':
            admission_year = 2023
            
        elif self.level == '100':
            admission_year = 2024
            
    
        self.admission_year = admission_year

        super(Student, self).save(*args, **kwargs)


class Lecturer(models.Model): 
    title = models.CharField(max_length = 3)
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, null=True, blank = True)
    last_name = models.CharField(max_length=50)
    lecturer_id = models.CharField(max_length = 10)
    gender = models.CharField(max_length=10)
    date_of_birth = models.DateField(null=True, blank = True)
    age = models.IntegerField(null=True, blank = True)
    profile_pic = models.CharField(max_length = 10000, default='Profile Picture Set', null = True, blank = True)
    bio = models.TextField(blank = True, null = True)
    department = models.ForeignKey(Department, on_delete = models.CASCADE, default = 'CPEN')
    email = models.EmailField(default = 'lect@ug.gh')
    phone_number = models.CharField(max_length=20, null=True, blank = True)
    office = models.CharField(max_length=20, null=True, blank = True)

    def __str__(self):
        return f'{self.title}. {self.first_name} {self.last_name} - {self.lecturer_id}'

    def save(self, *args, **kwargs):
        try:
            dob = datetime.strptime(str(self.date_of_birth), '%Y-%m-%d').date()
            today = datetime.now().date()
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            self.age = age
        except (ValueError, TypeError):
            self.age = None

        if self.middle_name and len(self.middle_name) > 0:
            middle_initial = self.middle_name[0].lower()
        else:
            middle_initial = ''

        self.email = f'{self.first_name[0].lower()}{middle_initial}.{self.last_name.lower()}{str(self.lecturer_id)[5:8]}@lect.ug.edu.gh'

        if self.gender == "Male": 
            self.profile_pic = 'https://cdn4.iconfinder.com/data/icons/men-avatars-icons-set-2/256/8-512.png'
        elif self.gender == "Female":
            self.profile_pic = 'https://cdn1.iconfinder.com/data/icons/professional-avatar-6/140/avatar__women__teacher__professor__female-512.png'
        elif self.gender == "Others": 
            self.profile_pic = "https://m.media-amazon.com/images/I/61E3AssjE7L._AC_UY1000_.jpg"

        super(Lecturer, self).save(*args, **kwargs)



class Course(models.Model):
    code = models.CharField(max_length = 14)
    title = models.CharField(max_length = 1000)
    description = models.TextField(null=True, blank=True)
    credits = models.IntegerField(default = 3)
    type = models.CharField(max_length=20, default='Core')
    level = models.CharField(max_length = 12, default = '300')
    semester = models.CharField(max_length=6, default = '1')
    department = models.ForeignKey(Department, on_delete = models.CASCADE)
    lecturer = models.ForeignKey(Lecturer, on_delete = models.CASCADE)


    def __str__(self):
        return f'{self.code} - {self.title}'


    def save(self, *args, **kwargs):
       
        if 'CPEN' in self.code:
            self.department = Department.objects.get(id=1)
        elif 'BMEN' in self.code:
            self.department = Department.objects.get(id=2)
        elif 'FPEN' in self.code:
            self.department = Department.objects.get(id=4)
        elif 'MTEN' in self.code:
            self.department = Department.objects.get(id=3)
        elif 'AREN' in self.code:
            self.department = Department.objects.get(id=5)
        else:
            self.department =  Department.objects.get(id=9)
        super(Course, self).save(*args, **kwargs)
        
        
class Assignment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    content = models.TextField()
    hw_number = models.CharField(max_length=10)
    assigned_on = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(null=True, blank=True)

    def __str__(self): 
        return f"Assignment #{self.hw_number} - {self.course.title}"

class Project(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    content = models.TextField()
    project_number = models.CharField(max_length=10)
    project_type = models.CharField(max_length=25)
    assigned_on = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Project #{self.project_number} - {self.course.title} assigned  by {self.lecturer.last_name}"



class Registration(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, default=1)
    date = models.DateTimeField(auto_now_add=True)

    

    def __str__(self):
        return f"{self.student} registered for {self.course} on {self.date}"

    class Meta:
        # Enforce uniqueness of student and course combination
        unique_together = ('student', 'course')

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver


class Result(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    score = models.FloatField(null=True, default=0)
    grade = models.CharField(max_length=10, null=True, default='TBD')
    grade_point = models.FloatField(null=True, default=0)
    gpt = models.FloatField(null=True, default=0)
    cgpa = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    

    class Meta:
        # Enforce uniqueness of student and course combination
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.student} - {self.score} - {self.grade} in {self.course}"
    
    def calculate_grade_and_points(self):
        if self.score >= 80:
            grade = 'A'
            grade_point = 4.00
        elif 75 <= self.score < 80:
            grade = 'B+'
            grade_point = 3.50
        elif 70 <= self.score < 75:
            grade = 'B'
            grade_point = 3.00
        elif 65 <= self.score < 70:
            grade = 'C+'
            grade_point = 2.50
        elif 60 <= self.score < 65:
            grade = 'C'
            grade_point = 2.00
        elif 55 <= self.score < 60:
            grade = 'D+'
            grade_point = 1.50
        elif 50 <= self.score < 55:
            grade = 'D'
            grade_point = 1.00
        elif 40 <= self.score < 50:
            grade = 'E'
            grade_point = 0.50
        else:
            grade = 'F'
            grade_point = 0.00
        
        return grade, grade_point

    def save(self, *args, **kwargs):
        # Calculate gpt and weighted_marks
        self.grade, self.grade_point = self.calculate_grade_and_points()
        self.gpt = self.grade_point * self.course.credits
       

        # Calculate CGPA for the student
        previous_results = Result.objects.filter(student=self.student).exclude(pk=self.pk)
        total_gpt = sum([result.gpt for result in previous_results]) + self.gpt
        total_credits = sum([result.course.credits for result in previous_results]) + self.course.credits
        if total_credits > 0:
            self.cgpa = total_gpt / total_credits
        else:
            self.cgpa = 0

        # Call the superclass save method to save the record
        super(Result, self).save(*args, **kwargs)

# Signal to update student's CGPA after saving a result
@receiver(post_save, sender=Result)
def update_student_cgpa(sender, instance, **kwargs):
    student = instance.student
    results = Result.objects.filter(student=student)
    total_gpt = sum(result.gpt for result in results)
    total_credits = sum(result.course.credits for result in results)
    cgpa = total_gpt / total_credits if total_credits > 0 else 0
    student.cgpa = round(cgpa, 2)
    student.save()
    

# Signal to update student's CGPA after deleting a result
@receiver(post_delete, sender=Result)
def update_student_cgpa_on_delete(sender, instance, **kwargs):
    student = instance.student
    results = Result.objects.filter(student=student)
    total_gpt = sum(result.gpt for result in results)
    total_credits = sum(result.course.credits for result in results)
    cgpa = total_gpt / total_credits if total_credits > 0 else 0
    student.cgpa = round(cgpa, 2)
    student.save()
