import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const HomePage = () => {
  const { authState } = useAuth();

  // If the user is not authenticated
  if (!authState.isAuthenticated) {
    return (
      <div className="jumbotron bg-light text-center py-5">
        <div className="container">
          <h1 className="display-4">Welcome to the Student Management System</h1>
          <p className="lead mt-4">Manage student data efficiently and effortlessly. Access is restricted to authenticated users. Please log in or register to continue.</p>
          <hr className="my-4" />
          <Link to="/login" className="btn btn-primary btn-lg mx-2" role="button">Login</Link>
          <Link to="/register" className="btn btn-outline-primary btn-lg mx-2" role="button">Register</Link>
        </div>
      </div>
    );
  }

  // If the user is authenticated
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container text-center py-5" style={{ backgroundColor: '#87CEEB' }}>
        <h1 className="display-4 mb-4">Welcome to the Student Management System!</h1>
        <p className="lead text-muted mb-4">Here's what you can do with this system:</p>
        <div className="row">
          <div className="col-md-4">
            <div className="card mb-4 shadow-sm" style={{ backgroundColor: '#4682B4' }}>
              <div className="card-body">
                <h5 className="card-title text-white">Manage Students</h5>
                <p className="card-text text-white">View, add, and edit student profiles.</p>
                <Link to="/students" className="btn btn-outline-light">View Students</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4 shadow-sm" style={{ backgroundColor: '#5F9EA0' }}>
              <div className="card-body">
                <h5 className="card-title text-white">Manage Lecturers</h5>
                <p className="card-text text-white">View, add, and edit lecturer information.</p>
                <Link to="/lecturers" className="btn btn-outline-light">View Lecturers</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4 shadow-sm" style={{ backgroundColor: '#2F4F4F' }}>
              <div className="card-body">
                <h5 className="card-title text-white">Manage Courses</h5>
                <p className="card-text text-white">Register, view, and manage courses offered.</p>
                <Link to="/courses" className="btn btn-outline-light">View Courses</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default HomePage;
