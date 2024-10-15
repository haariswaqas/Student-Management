from django.urls import path, re_path
from . import views

urlpatterns = [

    # User Registration, Login URLs for Token Auth
    re_path('login', views.login), 
    re_path('register', views.register), 
    re_path('test_token', views.test_token),


    # Department URLs
    path('department_routes', views.get_department_routes, name = "get_department_routes"),
    path('departments/', views.get_departments, name = "get_departments"),
    path('departments/<str:pk>/', views.get_department, name = "get_department"),
    
    # Student URLs
    path('student_routes', views.get_student_routes, name="get_student_routes"),
    path('students/', views.get_students, name="get_students"),
    path('students/create/', views.create_student, name = "create_student"),
    path('students/<str:pk>/', views.get_student, name="get_student"), 
    path('students/<str:pk>/delete/', views.delete_student, name = "delete_student"),
    path('students/<str:pk>/update/', views.update_student, name = "update_student"),

    # Lecturer URLs
    path('lecturer_routes', views.get_lecturer_routes, name="get_lecturer_routes"),
    path('lecturers/', views.get_lecturers, name="get_lecturers"),
    path('lecturers/create/', views.create_lecturer, name="create_lecturer"),
    path('lecturers/<str:pk>/', views.get_lecturer, name="get_lecturer"),
    path('lecturers/<str:pk>/delete/', views.delete_lecturer, name="delete_lecturer"),
    path('lecturers/<str:pk>/update/', views.update_lecturer, name="update_lecturer"),

    # Course URLs
    path('course_routes', views.get_course_routes, name="get_course_routes"),
    path('courses/', views.get_courses, name="get_courses"),
    path('courses/create/', views.create_course, name="create_course"),
    path('courses/<str:pk>/', views.get_course, name="get_course"),
    path('courses/<str:pk>/delete/', views.delete_course, name="delete_course"),
    path('courses/<str:pk>/update/', views.update_course, name="update_course"),

    # Registration URLs
    path('registration_routes', views.get_registration_routes, name="get_registration_routes"),
    path('registrations/', views.get_registrations, name="get_registrations"),
    path('registrations/create/', views.create_registration, name="create_registration"),
    path('registrations/<str:pk>/', views.get_registration, name="get_registration"),
    path('registrations/<str:pk>/delete/', views.delete_registration, name="delete_registration"),
    path('registrations/<str:pk>/update/', views.update_registration, name="update_registration"),
    path('students/<str:student_id>/registrations/', views.get_student_registrations, name="get_student_registrations"),

    # Result URLs
    path('result_routes/', views.get_result_routes, name="get_result_routes"),
    path('results/', views.get_results, name="get_results"),
    path('results/create/', views.create_result, name="create_result"),
    path('results/<str:pk>/', views.get_result, name="get_result"),
    path('results/<str:pk>/delete/', views.delete_result, name="delete_result"),
    path('results/<str:pk>/update/', views.update_result, name="update_result"),
    path('students/<str:student_id>/results/', views.get_student_results, name="get_student_results"),

    # Assignment URLs
    path('assignment_routes/', views.get_assignment_routes, name="get_assignment_routes"),
    path('assignments/', views.get_assignments, name="get_assignments"),
    path('assignments/create/', views.create_assignment, name="create_assignment"),
    path('assignments/<str:pk>/', views.get_assignment, name="get_assignment"),
    path('assignments/<str:pk>/delete/', views.delete_assignment, name="delete_assignment"),
    path('assignments/<str:pk>/update/', views.update_assignment, name="update_assignment"), 

    # Project URLs
    path('project_routes/', views.get_project_routes, name="get_project_routes"),
    path('projects/', views.get_projects, name="get_projects"),
    path('projects/create/', views.create_project, name="create_project"),
    path('projects/<str:pk>/', views.get_project, name="get_project"),
    path('projects/<str:pk>/delete/', views.delete_project, name="delete_project"),
    path('projects/<str:pk>/update/', views.update_project, name="update_project")










]