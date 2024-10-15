import React, { useState } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const LoginForm = () => {
  const { authState, dispatch } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', formData);
      const token = response.data.token;
      dispatch({ type: 'LOGIN', payload: { token } });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (authState.isAuthenticated) {
    // If user is authenticated, redirect to home page
    return <Navigate to="/" />;
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="col-md-6 col-lg-5">
        {!authState.isAuthenticated ? (
          <form onSubmit={handleSubmit} className="bg-dark p-5 rounded shadow">
            <h2 className="form-group text-center mb-4 text-white">Login to Your Account</h2>
            
            {/* Username Input */}
            <div className="form-group mb-4">
              <label htmlFor="username" className="text-white">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your username"
              />
            </div>

            {/* Password Input */}
            <div className="form-group mb-4">
              <label htmlFor="password" className="text-white">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your password"
              />
            </div>

            {/* Login Button */}
            <div className="form-group text-center mb-4">
              <button type="submit" className="btn btn-primary btn-block">Login</button>
            </div>

            {/* Back to Home */}
            <div className="form-group text-center mb-4">
              <Link to="/" className="btn btn-secondary">Back to Home</Link>
            </div>

            {/* Register Link */}
            <p className="text-center text-white">
              Don’t have an account? <Link to="/register" className="text-success">Register</Link>
            </p>
          </form>
        ) : (
          <div className="alert alert-success text-center">
            Login successful. Welcome, {formData.username}!
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
