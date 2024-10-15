import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import DepartmentList from './lists/DepartmentList';
import CourseList from './lists/CourseList';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import StudentList from './lists/StudentList';
import LecturerList from './lists/LecturerList';
import Assignment from './lists/Assignment';
import Project from './lists/Project';
import RegistrationList from './lists/RegistrationList';
import StudentProfilePage from './pages/StudentProfilePage';
import LecturerProfilePage from './pages/LecturerProfilePage';
import StudentForm from './forms/StudentForm'; 
import LecturerForm from './forms/LecturerForm'; 
import CourseForm from './forms/CourseForm'; 
import AssignmentForm from './forms/AssignmentForm'; 
import ProjectForm from './forms/ProjectForm'; 
import RegisterCourseForm from './forms/RegisterCourseForm';
import ResultForm from './forms/ResultForm';
import RegistrationForm from './forms/RegistrationForm';
import LoginForm from './forms/LoginForm';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider, useAuth } from './components/AuthContext'; // Import AuthProvider and useAuth

import './App.css';

function App() {
  return (
    <AuthProvider> {/* Ensure that AuthProvider wraps the entire application */}
      <Router>
        <div className="App">
          <NavBar />
          <br></br>  
          <Routes>

            <Route element ={<PrivateRoute />}>
              <Route element={<StudentList />} path="/students" exact/>
              <Route element={<LecturerList />} path="/lecturers" exact/>
              <Route path="/student/:id" element={<StudentProfilePage />} />
              <Route path="/lecturer/:id" element={<LecturerProfilePage />} />
            <Route path="/add-student" element={<StudentForm />} />
            <Route path="/edit-student/:id" element={<StudentForm />} />
            <Route path="/add-lecturer" element={<LecturerForm />} />
            <Route path="/edit-lecturer/:id" element={<LecturerForm />} />
            <Route path="/departments" element={<DepartmentList />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/add-course" element={<CourseForm />} />
            <Route path="/edit-course/:id" element={<CourseForm />} />
            <Route path="/add-assignment" element={<AssignmentForm />} />
            <Route path="/assignments" element={<Assignment />} />
            <Route path="/edit-assignment/:id" element={<AssignmentForm />} />
            <Route path="/add-project" element={<ProjectForm />} />
            <Route path="/projects" element={<Project />} />
            <Route path="/edit-project/:id" element={<ProjectForm />} />
            <Route path="/registrations" element={<RegistrationList />} />
            <Route path="/register-course" element={<RegisterCourseForm />} />
            <Route path="/register-course/:id" element={<RegisterCourseForm />} />
            <Route path="/add-result" element={<ResultForm />} />
            <Route path="/edit-result/:id" element={<ResultForm />} />
            <Route path="/add-result/:id" element={<ResultForm />} />

            </Route>
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<HomePage />} />
          

          </Routes>
          <br></br>   <br></br>  <br></br>  <br></br>  <br></br>  <br></br>  <br></br>  <br></br>  <br></br>  <br></br> 
          <br></br>   <br></br>  <br></br>  <br></br>  <br></br>  <br></br>  <br></br>  <br></br>  <br></br>  <br></br> 
          <Footer />
         
        </div>
      </Router>
   </AuthProvider>
  );
}

export default App;

