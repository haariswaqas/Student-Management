from rest_framework import serializers
from .models import Department, Student, Lecturer, Course, Assignment, Project, Registration, Result
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ['id', 'username', 'password', 'email']

class DepartmentSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Department
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    department_code = serializers.CharField(source='department.code', read_only=True)
    

    class Meta:
        model = Student
        fields = '__all__'

class LecturerSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    department_code = serializers.CharField(source='department.code', read_only=True)

    class Meta:
        model = Lecturer
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    department_code = serializers.CharField(source='department.code', read_only=True)
    lecturer_title = serializers.CharField(source='lecturer.title', read_only=True)
    lecturer_first_name = serializers.CharField(source='lecturer.first_name', read_only=True)
    lecturer_middle_name = serializers.CharField(source='lecturer.middle_name', read_only=True)
    lecturer_last_name = serializers.CharField(source='lecturer.last_name', read_only=True)

    class Meta:
        model = Course
        fields = '__all__'

    extra_kwargs = {
            'department': {'required': False},
            'code': {'required': True},
        }

# this code works for allowing course registration only

class RegistrationSerializer(serializers.ModelSerializer):

    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
 

    course_title = serializers.CharField(source='course.title', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only = True)
    student_first_name = serializers.CharField(source='student.first_name', read_only=True)
    student_middle_name = serializers.CharField(source='student.middle_name', read_only=True)
    student_last_name = serializers.CharField(source='student.last_name', read_only=True)
   
    
   
    

    class Meta:
        model = Registration
        fields = '__all__'



class AssignmentSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='course.department.name', read_only=True)
    department_code = serializers.CharField(source='course.department.code', read_only=True)
 
 

    course_title = serializers.CharField(source='course.title', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only = True)

    lecturer_title = serializers.CharField(source='course.lecturer.title', read_only=True)
    lecturer_first_name = serializers.CharField(source='course.lecturer.first_name', read_only=True)
    lecturer_middle_name = serializers.CharField(source='course.lecturer.middle_name', read_only=True)
    lecturer_last_name = serializers.CharField(source='course.lecturer.last_name', read_only=True)

    class Meta:
        model = Assignment
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='course.department.name', read_only=True)
    department_code = serializers.CharField(source='course.department.code', read_only=True)
    
 

    course_title = serializers.CharField(source='course.title', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only = True)
    
    lecturer_title = serializers.CharField(source='course.lecturer.title', read_only=True)
    lecturer_first_name = serializers.CharField(source='course.lecturer.first_name', read_only=True)
    lecturer_middle_name = serializers.CharField(source='course.lecturer.middle_name', read_only=True)
    lecturer_last_name = serializers.CharField(source='course.lecturer.last_name', read_only=True)


    class Meta:
        model = Project
        fields = '__all__'
    
    

    


class ResultSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())

    course_title = serializers.CharField(source='course.title', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only = True)
    course_level = serializers.CharField(source='course.level', read_only=True)
    course_semester = serializers.CharField(source='course.semester', read_only=True)
    
    student_first_name = serializers.CharField(source='student.first_name', read_only=True)
    student_middle_name = serializers.CharField(source='student.middle_name', read_only=True)
    student_last_name = serializers.CharField(source='student.last_name', read_only=True)

    class Meta:
        model = Result
        fields = '__all__'




# class RegistrationSerializer(serializers.ModelSerializer):
#     student_id = serializers.StringRelatedField()
#     course_id = serializers.StringRelatedField()

#     class Meta:
#         model = Registration
#         fields = ['id', 'student_id', 'course_id', 'date']


# class RegistrationSerializer(serializers.ModelSerializer):
#     # student_id = StudentSerializer()
#     # course_id = CourseSerializer()

#     student_id = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
#     course_id = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())

#     class Meta:
#         model = Registration
#         fields = ['id', 'student_id', 'course_id', 'date']

    # def create(self, validated_data):
    #     student_data = validated_data.pop('student_id')
    #     course_data = validated_data.pop('course_id')

    #     student = Student.objects.get(pk=student_data['id'])
    #     course = Course.objects.get(pk=course_data['id'])

    #     registration = Registration.objects.create(student_id=student, course_id=course, **validated_data)
    #     return registration

# class RegistrationSerializer(serializers.ModelSerializer):
#     student_id = serializers.StringRelatedField()
#     course_id = serializers.StringRelatedField()

#     class Meta:
#         model = Registration
#         fields = ['id', 'student_id', 'course_id', 'date']

#     def create(self, validated_data):
#         student_id = validated_data.pop('student_id')
#         course_id = validated_data.pop('course_id')

#         student = Student.objects.get(id=student_id)
#         course = Course.objects.get(id=course_id)

#         return Registration.objects.create(student_id=student, course_id=course, **validated_data)

#     def update(self, instance, validated_data):
#         student_id = validated_data.pop('student_id', instance.student_id.id)
#         course_id = validated_data.pop('course_id', instance.course_id.id)

#         instance.student_id = Student.objects.get(id=student_id)
#         instance.course_id = Course.objects.get(id=course_id)
#         instance.save()

#         return instance
