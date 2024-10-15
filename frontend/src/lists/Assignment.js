import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [deletionStatus, setDeletionStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch assignments from the API
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/assignments/');
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  // Group assignments by course code and title
  const groupedAssignments = {};
  assignments.forEach((assignment) => {
    const key = `${assignment.course_code} - ${assignment.course_title}`;

    if (!groupedAssignments[key]) {
      groupedAssignments[key] = [];
    }
    groupedAssignments[key].push(assignment);
  });

  // Toggle the visibility of assignments in a group
  const toggleGroup = (key) => {
    setExpandedGroups({
      ...expandedGroups,
      [key]: !expandedGroups[key],
    });
  };

  const handleDeleteClick = async (assignmentId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/assignments/${assignmentId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 204) {
        // Assignment deleted successfully, update the UI or reload assignments
        fetchAssignments();
      } else {
        console.error(`Failed to delete assignment. Server returned:`, response.status);
      }
    } catch (error) {
      console.error(`Error deleting assignment`, error);
    }
  };

  const handleEditClick = (id) => {
    navigate(`/edit-assignment/${id}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mt-5 text-center">ASSIGNMENTS</h2>
      {assignments.length === 0 ? (
        <div className="alert alert-info mt-3">
          No Assignments Due. Please come back later.
        </div>
      ) : (
        Object.keys(groupedAssignments).map((key) => (
          <div key={key}>
            <button
              className={`btn btn-link toggle-button ${
                expandedGroups[key] ? 'expanded' : ''
              }`}
              onClick={() => toggleGroup(key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                marginBottom: '10px',
              }}
            >
              <i
                className={`bi bi-caret-${
                  expandedGroups[key] ? 'down' : 'right'
                }-fill toggle-icon`}
                style={{ fontSize: '1rem', marginRight: '0.5rem' }}
              ></i>
              <h4 style={{ fontWeight: 'bold', marginBottom: '0' }}>{key}</h4>
            </button>
            {expandedGroups[key] && (
              <div>
                {groupedAssignments[key].map((assignment) => (
                  <div key={assignment.id} className="card mb-4">
                    <div className="card-header" style={{ backgroundColor: '#0055A4' }}>
                      <h5 className="card-title-light text-white">
                        {assignment.course.course_title}
                      </h5>
                    </div>
                    <div className="card-body bg-dark text-white">
                      <div className="assignment-content mb-3">
                        <h6 className="mb-2">ASSIGNMENT {assignment.hw_number}</h6>
                        <p>{assignment.content}</p>
                      </div>
                      <div className="row">
                        <div className="col-md-10">
                          <span className="mb-1">
                            <strong>Date Assigned:</strong> {assignment.assigned_on}
                          </span>
                          <p className="mb-1">
                            <strong>Due:</strong> {assignment.due_date}
                          </p>
                        </div>
                        <div className="col-md-7">
                          <p className="mb-1">
                            <strong>Assigned By:</strong> {assignment.lecturer_title}.{' '}
                            {assignment.lecturer_last_name}
                          </p>
                        </div>
                        <div className="col-md-5 text-right">
                          {/* Add Edit and Delete Buttons */}
                          <div className="mt-3" style={{ marginLeft: '5px' }}>
                            <button
                              className="btn btn-primary mr-2"
                              onClick={() => handleEditClick(assignment.id)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeleteClick(assignment.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Assignment;
