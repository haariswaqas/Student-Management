import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

const NavBar = () => {
  const { authState, dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('token');
    navigate('/'); // Redirect to the login page after logout
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{ padding: '15px 60px' }}>
      <Navbar.Brand as={Link} to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8f9fa' }}>
        STUDENT MANAGEMENT SYSTEM
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarNav" />
      <Navbar.Collapse id="navbarNav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/" style={{ marginRight: '15px', color: '#f8f9fa' }}>
            Home
          </Nav.Link>
          {authState.isAuthenticated ? (
            <NavDropdown title="Students" id="student-dropdown" style={{ marginRight: '15px' }}>
              <NavDropdown.Item as={Link} to="/students">View Students</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/add-student">Add Student</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/add-result">Add Result</NavDropdown.Item>
            </NavDropdown>
          ) : null}
          {authState.isAuthenticated ? (
            <NavDropdown title="Lecturers" id="lecturer-dropdown" style={{ marginRight: '15px' }}>
              <NavDropdown.Item as={Link} to="/lecturers">View All Lecturers</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/add-lecturer">Add Lecturer</NavDropdown.Item>
            </NavDropdown>
          ) : null}
          {/* {authState.isAuthenticated ? (
            <NavDropdown title="Assignments" id="assignment-dropdown" style={{ marginRight: '15px' }}>
              <NavDropdown.Item as={Link} to="/assignments">View All Assignments</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/add-assignment">Add Assignment</NavDropdown.Item>
            </NavDropdown>
          ) : null}
          {authState.isAuthenticated ? (
            <NavDropdown title="Projects" id="project-dropdown" style={{ marginRight: '15px' }}>
              <NavDropdown.Item as={Link} to="/projects">View All Projects</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/add-project">Add Project</NavDropdown.Item>
            </NavDropdown>
          ) : null} */}
          {authState.isAuthenticated ? (
            <NavDropdown title="Courses" id="course-dropdown" style={{ marginRight: '15px' }}>
              <NavDropdown.Item as={Link} to="/courses">View Courses</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/registrations">View Course Registrations</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/register-course">Course Registration</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/add-course">Add Course</NavDropdown.Item>
            </NavDropdown>
          ) : null}
        </Nav>
        {authState.isAuthenticated ? (
          <Navbar.Collapse className="justify-content-end">
            <Button
              variant="outline-danger"
              style={{ marginRight: '15px', borderRadius: '25px', padding: '8px 20px' }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Navbar.Collapse>
        ) : (
          <Navbar.Collapse className="justify-content-end">
            <Button
              variant="outline-success"
              style={{ marginRight: '10px', borderRadius: '25px', padding: '8px 20px' }}
              as={Link} to="/login"
            >
              Login
            </Button>
            <Button
              variant="outline-primary"
              style={{ marginRight: '60px', borderRadius: '25px', padding: '8px 20px' }}
              as={Link} to="/register"
            >
              Register
            </Button>
          </Navbar.Collapse>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
