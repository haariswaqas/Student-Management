import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [deletionStatus, setDeletionStatus] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [actionsVisible, setActionsVisible] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  const [allExpanded, setAllExpanded] = useState(false); // For expand all departments

  useEffect(() => {
    getStudents();
   
    
  }, []);

  

  const getStudents = async () => {
    try {
      let response = await fetch(`http://127.0.0.1:8000/api/students/`);
      let data = await response.json();
      setStudents(data);
      setDeletionStatus(null);
    } catch (error) {
      console.error('Error fetching students', error);
    }
  };


  const getCookie = (name) => {
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
  };

  const deleteStudent = async (studentId) => {
    try {
      const csrfToken = getCookie('csrftoken');

      const response = await fetch(`http://127.0.0.1:8000/api/students/${studentId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
      });

      if (response.status === 204) {
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.id !== studentId)
        );
        setDeletionStatus('Student deleted successfully');
      } else {
        console.error('Failed to delete student. Server returned:', response.status);
      }
    } catch (error) {
      console.error('Error deleting student', error);
    }
  };

  const toggleActionsVisibility = (studentId) => {
    setActionsVisible((prevVisible) => ({
      ...prevVisible,
      [studentId]: !prevVisible[studentId],
    }));
  };

  const studentsByDepartmentAndLevel = students.reduce((acc, student) => {
    const department = student.department_name;
    const level = student.level;
   

    if (!acc[department]) {
      acc[department] = {};
    }

    if (!acc[department][level]) {
      acc[department][level] = [];
    }

    acc[department][level].push(student);
    return acc;
  }, {});

  const toggleAllDepartments = () => {
    const newExpandedGroups = {};
  
    Object.entries(studentsByDepartmentAndLevel).forEach(([department, departmentLevels]) => {
      newExpandedGroups[department] = !allExpanded; // Toggle the department itself
  
      Object.keys(departmentLevels).forEach((level) => {
        newExpandedGroups[`${department}-${level}`] = !allExpanded; // Toggle each level under the department
      });
    });
  
    setExpandedGroups(newExpandedGroups);
    setAllExpanded(!allExpanded);
  };
  

  return (
    <div className="container mt-4 student-list-container">
      <h2 className="text-center text-white mb-4">Students</h2>

      {deletionStatus && (
        <div className="alert alert-success">{deletionStatus}</div>
      )}

      <div className="mb-4 text-right">
        <button
          className="btn btn-primary"
          onClick={toggleAllDepartments}
        >
          {allExpanded ? 'Done' : 'Show All Students'}
        </button>
      </div>

      {Object.entries(studentsByDepartmentAndLevel).map(
        ([department, departmentLevels]) => (
          <div key={department} className="mb-4 department-section">
            <button
              className={`btn btn-link toggle-button ${expandedGroups[department] ? 'expanded' : ''}`}
              onClick={() => {
                setExpandedGroups({
                  ...expandedGroups,
                  [department]: !expandedGroups[department],
                });
              }}
            >
              <i className={`bi bi-caret-${expandedGroups[department] ? 'down' : 'right'}-fill toggle-icon`}></i>
              <h4 style={{ textDecoration: 'none' }}>{department} Students</h4>
            </button>

            {expandedGroups[department] && (
              <div>
                {Object.entries(departmentLevels).map(([level, levelStudents]) => (
                  <div key={level} className="level-section">
                    <button
                      className={`btn btn-link toggle-button ${expandedGroups[`${department}-${level}`] ? 'expanded' : ''}`}
                      onClick={() => {
                        setExpandedGroups({
                          ...expandedGroups,
                          [`${department}-${level}`]: !expandedGroups[`${department}-${level}`],
                        });
                      }}
                    >
                      <i className={`bi bi-caret-${expandedGroups[`${department}-${level}`] ? 'down' : 'right'}-fill toggle-icon`}></i>
                      <h5 style={{ textDecoration: 'none' }}>Level {level}</h5>
                    </button>

                    {expandedGroups[`${department}-${level}`] && (
                      <table className="table table-hover table-dark">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {levelStudents.map((student) => (
                            <tr key={student.id}>
                              <td>
                                <Link to={`/student/${student.id}`} className="text-white" style={{ textDecoration: 'none' }}>
                                  {student.student_id}
                                </Link>
                              </td>
                              <td>
                                <Link to={`/student/${student.id}`} className="text-white" style={{ textDecoration: 'none' }}>
                                  {`${student.first_name} ${student.middle_name || ''} ${student.last_name}`}
                                </Link>
                              </td>
                              <td>{student.email}</td>
                              <td>{student.phone_number}</td>
                              <td>
                                <div className="d-flex">
                                  <button
                                    onClick={() => navigate(`/edit-student/${student.id}`)}
                                    className={`btn btn-warning mr-2 ${actionsVisible[student.id] ? '' : 'd-none'}`}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteStudent(student.id)}
                                    className={`btn btn-danger mr-2 ${actionsVisible[student.id] ? '' : 'd-none'}`}
                                  >
                                    Delete
                                  </button>
                                  <button
                                    className="btn btn-primary"
                                    onClick={() => toggleActionsVisibility(student.id)}
                                  >
                                    {actionsVisible[student.id] ? 'Done' : 'Manage'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default StudentList;
