from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer, DepartmentSerializer, StudentSerializer, LecturerSerializer, CourseSerializer, AssignmentSerializer, ProjectSerializer, RegistrationSerializer, ResultSerializer
from .models import Department, Student, Lecturer, Course, Project, Assignment, Registration, Result
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

# Create your views here.

# Adding Login and Registration token-based authentication

@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username = request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({
            "detail": "Not Found"
        }, 
        status = status.HTTP_404_NOT_FOUND
        )
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)

    return Response({
            "token": token.key,
            "user": serializer.data
            
            })

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        return Response({
            "token": token.key,
            "user": serializer.data
            
            })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("Passed for {}".format(request.user.email))




# APIs for Departments
@api_view(['GET'])
def get_department_routes(request):
    department_routes = [
        {
            'Endpoint': '/departments/',
            'method': 'GET',
            'body': None,
            'description': 'Shows all the departments in SES'
        },
          {
            'Endpoint': '/departments/id',
            'method': 'GET',
            'body': None,
            'description': 'returns a single particular department based on unique id'
        },
          {
            'Endpoint': '/departments/id/update',
            'method': 'PUT',
            'body': {'body': ""},
            'description': 'allows the SES admin to edit existing department info'
        },
          {
            'Endpoint': '/departments/id/delete',
            'method': 'DELETE',
            'body': None,
            'description': 'Shows all the departments in SES'
        }
    ]
    return Response(department_routes)



@api_view(['GET'])
def get_departments(request):
    departments = Department.objects.all()
    serializer = DepartmentSerializer(departments, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_department(request, pk):
    department = Department.objects.get(id=pk)
    serializer = DepartmentSerializer(department, many=False)
    return Response(serializer.data)






# APIs for Students
@api_view(['GET'])
def get_student_routes(request):
    student_routes = [
        {
            'Endpoint': '/students/',
            'method': 'GET',
            'body': None,
            'description': 'Shows all the students in SES'
        },
        {
            'Endpoint': '/students/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single particular student based on a unique id'
        },
        {
            'Endpoint': '/students/id/update',
            'method': 'PUT',
            'body': {'body': ""},
            'description': 'Allows the SES admin to edit existing student info'
        },
        {
            'Endpoint': '/students/id/delete',
            'method': 'DELETE',
            'body': None,
            'description': 'Shows all the students in SES'
        }
    ]
    return Response(student_routes)


@api_view(['GET'])
def get_students(request):
    students = Student.objects.all()
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_student(request, pk):
    student = Student.objects.get(id=pk)
    serializer = StudentSerializer(student, many=False)
    return Response(serializer.data)




@api_view(['POST'])
def create_student(request):
    serializer = StudentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['PUT'])
def update_student(request, pk):
    try:
        student = Student.objects.get(id=pk)
    except Student.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = StudentSerializer(student, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['DELETE'])
def delete_student(request, pk):
    student = Student.objects.get(id=pk)
    student.delete()
    return Response('Student expelled Successfully!')



# APIs for Lecturers

@api_view(['GET'])
def get_lecturer_routes(request):
    lecturer_routes = [
        {
            'Endpoint': '/lecturers/',
            'method': 'GET',
            'body': None,
            'description': 'Shows all the lecturers in SES'
        },
        {
            'Endpoint': '/lecturers/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single particular lecturer based on a unique id'
        },
        {
            'Endpoint': '/lecturers/id/update',
            'method': 'PUT',
            'body': {'body': ""},
            'description': 'Allows the SES admin to edit existing lecturer info'
        },
        {
            'Endpoint': '/lecturers/id/delete',
            'method': 'DELETE',
            'body': None,
            'description': 'Deletes lecturers in SES'
        }
    ]
    return Response(lecturer_routes)


@api_view(['GET'])
def get_lecturers(request):
    lecturers = Lecturer.objects.all()  
    serializer = LecturerSerializer(lecturers, many=True)  
    return Response(serializer.data)

@api_view(['GET'])
def get_lecturer(request, pk):
    lecturer = Lecturer.objects.get(id=pk) 
    serializer = LecturerSerializer(lecturer, many=False)  
    return Response(serializer.data)

@api_view(['POST'])
def create_lecturer(request):
    serializer = LecturerSerializer(data=request.data)  
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_lecturer(request, pk):
    try:
        lecturer = Lecturer.objects.get(id=pk)
    except Lecturer.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = LecturerSerializer(lecturer, data=request.data)  
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_lecturer(request, pk):
    lecturer = Lecturer.objects.get(id=pk)  
    lecturer.delete()
    return Response('Lecturer expelled Successfully!')




# APIs for Courses

@api_view(['GET'])
def get_course_routes(request):
    course_routes = [
        {
            'Endpoint': '/courses/',
            'method': 'GET',
            'body': None,
            'description': 'Shows all the courses in SES'
        },
        {
            'Endpoint': '/courses/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single particular lecturer based on a unique id'
        },
        {
            'Endpoint': '/courses/id/update',
            'method': 'PUT',
            'body': {'body': ""},
            'description': 'Allows the SES admin to edit existing lecturer info'
        },
        {
            'Endpoint': '/courses/id/delete',
            'method': 'DELETE',
            'body': None,
            'description': 'Deletes lecturers in SES'
        }
    ]
    return Response(course_routes)


@api_view(['GET'])
def get_courses(request):
    courses = Course.objects.all()
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_course(request, pk):
    course = Course.objects.get(id=pk)
    serializer = CourseSerializer(course, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def create_course(request):
    serializer = CourseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_course(request, pk):
    try:
        course = Course.objects.get(id=pk)
    except Course.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = CourseSerializer(course, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_course(request, pk):
    course = Course.objects.get(id=pk)
    course.delete()
    return Response('Course deleted Successfully!')



@api_view(['GET'])
def get_registration_routes(request):
    registration_routes = [
        {
            'Endpoint': '/registrations/',
            'method': 'GET',
            'body': None,
            'description': 'Shows all the registrations in SES'
        },
        {
            'Endpoint': '/registrations/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single particular registration based on a unique id'
        },
        {
            'Endpoint': '/registrations/id/update',
            'method': 'PUT',
            'body': {'body': ""},
            'description': 'Allows the SES admin to edit existing registration info'
        },
        {
            'Endpoint': '/registrations/id/delete',
            'method': 'DELETE',
            'body': None,
            'description': 'Deletes registrations in SES'
        }
    ]
    return Response(registration_routes)




@api_view(['GET'])
def get_registrations(request):
    registrations = Registration.objects.all()
    serializer = RegistrationSerializer(registrations, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_registration(request, pk):
    registration = Registration.objects.get(id=pk)
    serializer = RegistrationSerializer(registration, many=False)
    return Response(serializer.data)

# @api_view(['POST'])
# def create_registration(request):
#     serializer = RegistrationSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_registration(request):
    student_id = request.data.get('student')
    course_id = request.data.get('course')

    try:
        # Fetch the student and course based on the provided IDs
        student = Student.objects.get(id=student_id)
        course = Course.objects.get(id=course_id)

        # Check if the student's department matches the course's department
        if student.department != course.department:
            return Response(
                {"error": "The student's department does not match the course's department."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if the student's level matches the course's level
        if student.level != course.level:
            return Response(
                {"error": "The student's level does not match the course's level."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # If checks pass, proceed to register the course
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Student.DoesNotExist:
        return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)
    except Course.DoesNotExist:
        return Response({"error": "Course not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
def update_registration(request, pk):
    try:
        registration = Registration.objects.get(id=pk)
    except Registration.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = RegistrationSerializer(registration, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_registration(request, pk):
    registration = Registration.objects.get(id=pk)
    registration.delete()
    return Response('Registration deleted Successfully!')

@api_view(['GET'])
def get_student_registrations(request, student_id):
    registrations = Registration.objects.filter(student_id=student_id)
    serializer = RegistrationSerializer(registrations, many=True)
    return Response(serializer.data)


# Result model APIs

@api_view(['GET'])
def get_result_routes(request):
    result_routes = [
        {
            'Endpoint': '/results/',
            'method': 'GET',
            'body': None,
            'description': 'Shows all the results in SES'
        },
        {
            'Endpoint': '/results/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single particular result based on a unique id'
        },
        {
            'Endpoint': '/results/id/update',
            'method': 'PUT',
            'body': {'body': ""},
            'description': 'Allows the SES admin to edit existing result info'
        },
        {
            'Endpoint': '/results/id/delete',
            'method': 'DELETE',
            'body': None,
            'description': 'Deletes results in SES'
        }
    ]
    return Response(result_routes)

@api_view(['GET'])
def get_results(request):
    results = Result.objects.all()
    serializer = ResultSerializer(results, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_result(request, pk):
    result = Result.objects.get(id=pk)
    serializer = ResultSerializer(result, many=False)
    return Response(serializer.data)

# @api_view(['POST'])
# def create_result(request):
#     serializer = ResultSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_result(request):
    student_id = request.data.get('student')
    course_id = request.data.get('course')

    # Check if the student is registered for the course
    is_registered = Registration.objects.filter(student_id=student_id, course_id=course_id).exists()

    if not is_registered:
        return Response(
            {"error": "Student is not registered for this course."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Proceed with result creation if the student is registered
    serializer = ResultSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_result(request, pk):
    try:
        result = Result.objects.get(id=pk)
    except Result.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = ResultSerializer(result, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_result(request, pk):
    result = Result.objects.get(id=pk)
    result.delete()
    return Response('Result deleted Successfully!')

@api_view(['GET'])
def get_student_results(request, student_id):
    results = Result.objects.filter(student_id=student_id)
    serializer = ResultSerializer(results, many=True)
    return Response(serializer.data)


# Replace "course" with "assignment" and "courses" with "assignments"
@api_view(['GET'])
def get_assignment_routes(request):
    assignment_routes = [
        {
            'Endpoint': '/assignments/',
            'method': 'GET',
            'body': None,
            'description': 'Shows all the assignments in SES'
        },
        {
            'Endpoint': '/assignments/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single particular assignment based on a unique id'
        },
        {
            'Endpoint': '/assignments/id/update',
            'method': 'PUT',
            'body': {'body': ""},
            'description': 'Allows the SES admin to edit existing assignment info'
        },
        {
            'Endpoint': '/assignments/id/delete',
            'method': 'DELETE',
            'body': None,
            'description': 'Deletes assignments in SES'
        }
    ]
    return Response(assignment_routes)

@api_view(['GET'])
def get_assignments(request):
    assignments = Assignment.objects.all()
    serializer = AssignmentSerializer(assignments, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_assignment(request, pk):
    assignment = Assignment.objects.get(id=pk)
    serializer = AssignmentSerializer(assignment, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def create_assignment(request):
    serializer = AssignmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_assignment(request, pk):
    try:
        assignment = Assignment.objects.get(id=pk)
    except Assignment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = AssignmentSerializer(assignment, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_assignment(request, pk):
    assignment = Assignment.objects.get(id=pk)
    assignment.delete()
    return Response('Assignment deleted Successfully!')


@api_view(['GET'])
def get_project_routes(request):
    project_routes = [
        {
            'Endpoint': '/projects/',
            'method': 'GET',
            'body': None,
            'description': 'Shows all the projects in SES'
        },
        {
            'Endpoint': '/projects/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single particular project based on a unique id'
        },
        {
            'Endpoint': '/projects/id/update',
            'method': 'PUT',
            'body': {'body': ""},
            'description': 'Allows the SES admin to edit existing project info'
        },
        {
            'Endpoint': '/projects/id/delete',
            'method': 'DELETE',
            'body': None,
            'description': 'Deletes projects in SES'
        }
    ]
    return Response(project_routes)

@api_view(['GET'])
def get_projects(request):
    projects = Project.objects.all()
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_project(request, pk):
    project = Project.objects.get(id=pk)
    serializer = ProjectSerializer(project, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def create_project(request):
    serializer = ProjectSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_project(request, pk):
    try:
        project = Project.objects.get(id=pk)
    except Project.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = ProjectSerializer(project, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_project(request, pk):
    project = Project.objects.get(id=pk)
    project.delete()
    return Response('Project deleted Successfully!')
