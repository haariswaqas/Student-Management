import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const RegistrationForm = () => {
  const { dispatch } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', formData);
      const token = response.data.token;
      dispatch({ type: 'LOGIN', payload: { token } });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <form onSubmit={handleSubmit} className="bg-dark p-5 rounded">
            <h2 className="text-center text-white form-group mb-4">Registration</h2>
            <div className="form-group mb-4">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-control"
                placeholder="Username"
              />
            </div>
            <div className="form-group mb-4">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Email"
              />
            </div>
            <div className="form-group mb-4">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Password"
              />
            </div>
            <div className="form-group mb-5">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control"
                placeholder="Confirm Password"
              />
            </div>
            <div className="form-group text-center mb-4">
              <button type="submit" className="btn btn-success">Register</button>
            </div>
            <div className="form-group text-center mb-4">
              <Link to="/" className="btn btn-secondary">Back to Home</Link>
            </div>
            <p className="text-center text-white">
              Already have an account? <Link to="/login" className="btn btn-primary">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
