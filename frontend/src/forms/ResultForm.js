import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';

const ResultForm = () => {
  const { id } = useParams(); // Result ID for editing
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studentId = queryParams.get('studentId'); // Get studentId from query params

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState(''); // Selected course ID
  const [alertMessage, setAlertMessage] = useState(null); // Alert message for success or error

  const [resultData, setResultData] = useState({
    student: '',
    course: '',
    score: '',
  });

  // Prefill the student field and set it as read-only if studentId exists
  useEffect(() => {
    if (studentId) {
      setResultData((prevData) => ({
        ...prevData,
        student: studentId,
      }));
    }
  }, [studentId]);

  // Helper function to retrieve CSRF token
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
      fetchResultData();
    }
    fetchCourses();
    fetchStudents();
  }, [id]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/students/`);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/courses/`);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchResultData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/results/${id}`);
      const data = await response.json();
      setResultData(data);
      setCourseId(data.course);
    } catch (error) {
      console.error('Error fetching result data', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResultData({
      ...resultData,
      [name]: value,
    });

    if (name === 'course') {
      setCourseId(value);
    }
  };

  const createOrUpdateResult = async (e) => {
    e.preventDefault();
  
    try {
      const updatedResultData = {
        ...resultData,
        course: courseId,
      };
  
      const apiUrl = id
        ? `http://127.0.0.1:8000/api/results/${id}/update/`
        : 'http://127.0.0.1:8000/api/results/create/';
  
      const method = id ? 'PUT' : 'POST';
      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(updatedResultData),
      });
  
      if (response.status === 201 || response.status === 200) { // Check for both success statuses
        const result = await response.json();
        setAlertMessage(
          <div className="alert alert-success">
            Result {id ? 'updated' : 'added'} successfully! ID: {result.id}
          </div>
        );
  
        // Clear form data
        setResultData({
          student: '',
          course: '',
          score: '',
        });
  
        // Navigate to the student's profile page
        navigate(`/student/${updatedResultData.student}`); // Use updatedResultData.student
      } else if (response.status === 400) {
        const errorData = await response.json();
        setAlertMessage(
          <div className="alert alert-danger">
            {errorData.error}
            {/* If the error is related to course registration, show the link to RegisterCourseForm */}
            {errorData.error.includes('already registered') && (
              <p>
                This student is already registered for this course.{' '}
                <Link
                  to={`/register-course?studentId=${resultData.student}`}
                  className="alert-link"
                >
                  Register for another course
                </Link>.
              </p>
            )}
          </div>
        );
      } else {
        console.error(`Failed to ${id ? 'update' : 'add'} result. Server returned:`, response.status);
      }
    } catch (error) {
      console.error(`Error ${id ? 'updating' : 'adding'} result`, error);
      setAlertMessage(
        <div className="alert alert-danger">
          An unexpected error occurred. Please try again.
        </div>
      );
    }
  };
  

  return (
    <div className="container">
      <div
        className="p-4"
        style={{
          backgroundColor: '#d1ecf1', // Light blue background
          borderRadius: '8px',
        }}
      >
        <h2 className="text-center mb-4" style={{ color: '#0c5460' }}>
          {id ? 'Change' : 'Add'} Result
        </h2>

        {alertMessage && alertMessage}

        <form onSubmit={createOrUpdateResult}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <select
                  className="form-control"
                  id="student"
                  name="student"
                  value={resultData.student}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.student_id} - {student.first_name} {student.middle_name} {student.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <br />
            <div className="col-md-6">
              <div className="form-group">
                <select
                  className="form-control"
                  id="course"
                  name="course"
                  value={resultData.course}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <input
                  className="form-control"
                  id="score"
                  name="score"
                  type="number"
                  value={resultData.score}
                  onChange={handleChange}
                  required
                  placeholder="Score (%)"
                />
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-12 text-center">
              <button type="submit" className="btn btn-primary">
                {id ? 'Save Result' : 'Add Result'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResultForm;
