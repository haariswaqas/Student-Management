import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [deletionStatus, setDeletionStatus] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [allExpanded, setAllExpanded] = useState(false); // New state for expanding/collapsing all
  const navigate = useNavigate();

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = async () => {
    try {
      let response = await fetch(`http://127.0.0.1:8000/api/courses/`);
      let data = await response.json();
      setCourses(data);
      setDeletionStatus(null);
    } catch (error) {
      console.error('Error fetching courses', error);
    }
  };

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

  const deleteCourse = async (courseId) => {
    try {
      const csrfToken = getCookie('csrftoken');
      const response = await fetch(`http://127.0.0.1:8000/api/courses/${courseId}/delete/`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        }
      });

      if (response.status === 204) {
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== courseId)
        );
        setDeletionStatus('Course deleted successfully');
      } else {
        console.error('Failed to delete course. Server returned:', response.status);
      }
    } catch (error) {
      console.error('Error deleting course', error);
    }
  };

  const toggleExpansion = (groupKey) => {
    setExpandedGroups((prevExpanded) => ({
      ...prevExpanded,
      [groupKey]: !prevExpanded[groupKey],
    }));
  };

  // New function to toggle expand/collapse for all departments and courses
  const toggleAll = () => {
    if (allExpanded) {
      setExpandedGroups({}); // Collapse all
    } else {
      // Expand all departments and their levels
      const allGroups = {};
      courses.forEach((course) => {
        allGroups[course.department_name] = true;
        allGroups[`${course.department_name}-${course.level}`] = true;
      });
      setExpandedGroups(allGroups);
    }
    setAllExpanded(!allExpanded); // Toggle the button state
  };

  const coursesByHierarchy = courses.reduce((acc, course) => {
    const department = course.department_name;
    const level = course.level;
    const semester = course.semester;

    if (!acc[department]) {
      acc[department] = {};
    }

    if (!acc[department][level]) {
      acc[department][level] = {};
    }

    if (!acc[department][level][semester]) {
      acc[department][level][semester] = [];
    }

    acc[department][level][semester].push(course);
    return acc;
  }, {});

  return (
    <div className="container mt-4">
      <h2 className="text-white">Courses</h2>
      {deletionStatus && (
        <div className="alert alert-success">{deletionStatus}</div>
      )}

      {/* Expand/Collapse All Button */}
      <button className="btn btn-primary mb-3" onClick={toggleAll}>
        {allExpanded ? 'Done' : 'Show All Courses'}
      </button>

      {Object.entries(coursesByHierarchy).map(([department, departmentLevels]) => (
        <div key={department}>
          <button
            className={`btn btn-link toggle-button ${
              expandedGroups[department] ? 'expanded' : ''
            }`}
            onClick={() => toggleExpansion(department)}
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '1rem',
            }}
          >
            <i
              className={`bi bi-caret-${
                expandedGroups[department] ? 'down' : 'right'
              }-fill toggle-icon`}
              style={{ fontSize: '1rem', marginRight: '0.5rem' }}
            ></i>
            <h4 style={{  textUnderlineOffset: 'none' }}>{department} Courses</h4>
          </button>

          {expandedGroups[department] && (
            <div>
              {Object.entries(departmentLevels).map(([level, levelSemesters]) => (
                <div key={level}>
                  <button
                    className={`btn btn-link toggle-button ${
                      expandedGroups[`${department}-${level}`] ? 'expanded' : ''
                    }`}
                    onClick={() => toggleExpansion(`${department}-${level}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '1rem',
                    }}
                  >
                    <i
                      className={`bi bi-caret-${
                        expandedGroups[`${department}-${level}`] ? 'down' : 'right'
                      }-fill toggle-icon`}
                      style={{ fontSize: '1rem', marginRight: '0.5rem' }}
                    ></i>
                    <h5>Level {level}</h5>
                  </button>
                  {expandedGroups[`${department}-${level}`] && (
                    <div>
                      {Object.entries(levelSemesters).map(([semester, semesterCourses]) => (
                        <div key={semester}>
                          <button
                            className={`btn btn-link toggle-button`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              textDecoration: 'none',
                              justifyContent: 'center',
                              fontSize: '1rem',
                              width: '100%',
                            }}
                          >
                            <h6 style={{ margin: 0 }}>Semester {semester}</h6>
                          </button>
                          <table className="table table-hover table-dark">
                            <thead>
                              <tr>
                                <th>Course Code</th>
                                <th>Course Title</th>
                                <th>Course Instructor</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {semesterCourses.map((course) => (
                                <tr key={course.id}>
                                  <td  className="text-white"
                                      style={{ textDecoration: 'none' }}>
                                    
                                     
                                    
                                      {course.code}
                                    
                                  </td>
                                  <td  className="text-white"
                                      style={{ textDecoration: 'none' }}>
                                    
                                    
                                    
                                      {course.title}
                                    
                                  </td>

                                  <td  className="text-white"
                                      style={{ textDecoration: 'none' }}>
                                    
                                     
                                    
                                     {course.lecturer_title}. {course.lecturer_first_name} {course.lecturer_last_name}
                                    
                                  </td>
                                  <td>
                                    <div className="col-md-8">
                                      <div className="d-flex mb-1">
                                        <button
                                          className="btn btn-warning mr-2"
                                          onClick={() =>
                                            navigate(`/edit-course/${course.id}`)
                                          }
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => deleteCourse(course.id)}
                                          className="btn btn-danger ml-2"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseList;
