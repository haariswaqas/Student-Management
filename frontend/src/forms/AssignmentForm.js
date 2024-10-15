import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AssignmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]); // State for courses
  const [assignmentData, setAssignmentData] = useState({
    course: '',
    hw_number: '',
    content: '',
    assigned_on: '',
    due_date: '',
  });

  useEffect(() => {
    if (id) {
      fetchAssignmentData();
    }
    fetchCourses(); // Fetch courses when the component mounts

  }, [id]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/courses/`);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchAssignmentData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/assignments/${id}`);
      const data = await response.json();
      setAssignmentData(data);
    } catch (error) {
      console.error('Error fetching assignment data', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData({
      ...assignmentData,
      [name]: value,
    });
  };

  const createOrUpdateAssignment = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = id
        ? `http://127.0.0.1:8000/api/assignments/${id}/update/`
        : 'http://127.0.0.1:8000/api/assignments/create/';

      const method = id ? 'PUT' : 'POST';

      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(assignmentData),
      });

      if (response.status === 200 || response.status === 201) {
        console.log(`Assignment ${id ? 'updated' : 'created'} successfully`);
        // Clear the form fields after successful submission
        setAssignmentData({
          course: '',
          hw_number: '',
          content: '',
          assigned_on: '',
          due_date: '',
        });

        // Redirect to the assignment page if creating, or navigate to the updated assignment if editing
        id ? navigate('/assignments') : navigate('/assignments');
      } else {
        console.error(`Failed to ${id ? 'update' : 'create'} assignment. Server returned:`, response.status);
        // Handle the error or show an error message to the user
      }
    } catch (error) {
      console.error(`Error ${id ? 'updating' : 'creating'} assignment`, error);
      // Handle the error or show an error message to the user
    }
  };

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

  function formatNumberedItems(content) {
    const items = content.split('\n').filter((item) => item.trim() !== ''); // Split content into items
  
    // Format items as a numbered list
    return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
  }
  

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{id ? 'Edit' : 'Create'} Assignment</h2>
      <form onSubmit={createOrUpdateAssignment}>
        <div className="mb-4">
          <select
            className="form-select"
            id="course"
            name="course"
            value={assignmentData.course}
            onChange={handleChange}
            required
            placeholder="Course"
          >
            <option value="">Select a Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <textarea
            className="form-control"
            id="content"
            name="content"
            value={assignmentData.content}
            onChange={handleChange}
            required
            placeholder="Assignment Content"
          >
            {formatNumberedItems(assignmentData.content)}
          </textarea>
        </div>
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            id="hw_number"
            name="hw_number"
            value={assignmentData.hw_number}
            onChange={handleChange}
            required
            placeholder="Assignment No."
          />
        </div>
        <div className="mb-4">
          <input
            type="datetime-local"
            className="form-control"
            id="due_date"
            name="due_date"
            value={assignmentData.due_date}
            onChange={handleChange}
            placeholder="Due Date"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {id ? 'Update Assignment' : 'Upload Assignment'}
        </button>
      </form>
    </div>
  );
  
};

export default AssignmentForm;
