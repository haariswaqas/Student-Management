import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [lecturers, setLecturers] = useState([]);

  const [courseData, setCourseData] = useState({
    code: '',
    title: '',
    credits: '',
    type: '', 
    level: '',
    semester: '',
    department: '', 
    lecturer: '',
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
      fetchCourseData();
    }
    fetchLecturers();
    fetchDepartments();
  }, [id]);

  const fetchLecturers = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/lecturers/`);
      const data = await response.json();
      setLecturers(data);
    } catch (error) {
      console.error('Error fetching lecturers', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/departments/`);
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchCourseData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/courses/${id}`);
      const data = await response.json();
      setCourseData(data);
    } catch (error) {
      console.error('Error fetching course data', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value,
    });
  };

  const createOrUpdateCourse = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = id
        ? `http://127.0.0.1:8000/api/courses/${id}/update/`
        : 'http://127.0.0.1:8000/api/courses/create/';

      const method = id ? 'PUT' : 'POST';
      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(courseData),
      });

      if (response.status === 200 || response.status === 201) {
        setCourseData({
          code: '',
          title: '',
          credits: '',
          type: '', 
          level: '',
          semester: '',
          department: '', 
          lecturer: '',
        });

        navigate('/courses');
      } else {
        console.error(`Failed to ${id ? 'update' : 'create'} course. Server returned:`, response.status);
      }
    } catch (error) {
      console.error(`Error ${id ? 'updating' : 'creating'} course`, error);
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="p-5"
        style={{
          backgroundColor: '#e3f2fd', // Light blue background
          borderRadius: '10px', // Rounded corners
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Light shadow
        }}
      >
        <h2 className="text-center mb-4" style={{ color: '#007bff' }}>
          {id ? 'Update Course' : 'Create Course'}
        </h2>
        <form className="course-form" onSubmit={createOrUpdateCourse}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                id="code"
                name="code"
                placeholder="Course Code"
                value={courseData.code}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                placeholder="Course Title"
                value={courseData.title}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="number"
                className="form-control"
                id="credits"
                name="credits"
                placeholder="Credits"
                value={courseData.credits}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                id="type"
                name="type"
                placeholder="Course Type"
                value={courseData.type}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                id="level"
                name="level"
                placeholder="Level"
                value={courseData.level}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                id="semester"
                name="semester"
                placeholder="Semester"
                value={courseData.semester}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <select
                name="department"
                id="department"
                className="form-control"
                value={courseData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select a Department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name} ({department.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <select
                className="form-control"
                id="lecturer"
                name="lecturer"
                value={courseData.lecturer}
                onChange={handleChange}
                required
              >
                <option value="">Select a Lecturer</option>
                {lecturers.map((lecturer) => (
                  <option key={lecturer.id} value={lecturer.id}>
                    {lecturer.title}. {lecturer.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-center">
  <button
    type="submit"
    className="btn btn-success btn-md"
    style={{ backgroundColor: '#007bff', borderColor: '#007bff', padding: '10px 20px' }}
  >
    {id ? 'Update Course' : 'Create Course'}
  </button>
</div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
