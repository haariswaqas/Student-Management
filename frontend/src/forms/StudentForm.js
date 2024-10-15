import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);

  // State for student data and form fields
  const [studentData, setStudentData] = useState({
    student_id: '', 
    first_name: '',
    middle_name: '', 
    last_name: '',
    department: '',
    gender: '', 
    date_of_birth: '',
    shs: '', 
    bio: '',
    level: '', 
    phone_number: '',
  });

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  useEffect(() => {
    if (id) {
      fetchStudentData();
    }
    fetchDepartments();
  }, [id]);

  let fetchDepartments = async () => {
    try {
      let response = await fetch(`http://127.0.0.1:8000/api/departments/`);
      let data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchStudentData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/students/${id}`);
      const data = await response.json();
      setStudentData(data);
    } catch (error) {
      console.error('Error fetching student data', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData({
      ...studentData,
      [name]: value,
    });
  };

  const createOrUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = id
        ? `http://127.0.0.1:8000/api/students/${id}/update/`
        : 'http://127.0.0.1:8000/api/students/create/';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Csrftoken': getCookie('csrftoken'),
        },
        body: JSON.stringify(studentData),
      });

      if (response.status === 200 || response.status === 201) {
        setStudentData({
          student_id: '', 
          first_name: '',
          middle_name: '', 
          last_name: '',
          department: '',
          gender: '', 
          date_of_birth: '',
          shs: '', 
          bio: '',
          level: '', 
          phone_number: '',
        });

        id ? navigate(`/student/${id}`) : navigate('/students');
      } else {
        console.error(`Failed to ${id ? 'update' : 'create'} student. Server returned:`, response.status);
      }
    } catch (error) {
      console.error(`Error ${id ? 'updating' : 'creating'} student`, error);
    }
  };

  return (
    <form className="student-form" onSubmit={createOrUpdateStudent}>
      <div className="container mt-4 p-4" style={{ backgroundColor: '#fffde7', borderRadius: '8px' }}>
        <h3 className="text-center">{id ? `Edit Student Details` : 'Create New Student'}</h3>
        
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <input
                type="text"
                name="student_id"
                className="form-control mb-3"
                value={studentData.student_id}
                onChange={handleChange}
                required
                placeholder="Student ID"
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="first_name"
                className="form-control mb-3"
                value={studentData.first_name}
                onChange={handleChange}
                required
                placeholder="First Name"
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="middle_name"
                className="form-control mb-3"
                value={studentData.middle_name}
                onChange={handleChange}
                placeholder="Middle Name (Optional)"
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="last_name"
                className="form-control mb-3"
                value={studentData.last_name}
                onChange={handleChange}
                required
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <select
                name="department"
                className="form-control mb-3"
                value={studentData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <select
                name="gender"
                className="form-control mb-3"
                value={studentData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <input
                type="date"
                name="date_of_birth"
                className="form-control mb-3"
                value={studentData.date_of_birth}
                onChange={handleChange}
                required
                placeholder="Date of Birth"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <input
                type="text"
                name="shs"
                className="form-control mb-3"
                value={studentData.shs}
                onChange={handleChange}
                required
                placeholder="SHS"
              />
            </div>

            <div className="form-group">
              <textarea
                name="bio"
                className="form-control mb-3"
                value={studentData.bio}
                onChange={handleChange}
                placeholder="Bio"
              ></textarea>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <select
                name="level"
                className="form-control mb-3"
                value={studentData.level}
                onChange={handleChange}
                required
              >
                <option value="">Select Level</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
              </select>
            </div>

            <div className="form-group">
              <input
                type="text"
                name="phone_number"
                className="form-control mb-3"
                value={studentData.phone_number}
                onChange={handleChange}
                required
                placeholder="Phone Number"
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-warning px-5">
            {id ? `Save Details` : 'Add Student'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default StudentForm;
