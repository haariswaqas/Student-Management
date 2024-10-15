import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState({});
    const [registrations, setRegistrations] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletionStatus, setDeletionStatus] = useState(false);
  

    const getStudent = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/students/${id}`);
            const data = response.data;
            setStudent(data);
        } catch (error) {
            console.error('Error fetching student profile information', error);
        }
    };

    const getStudentRegistrations = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/students/${id}/registrations/`);
            const data = response.data;
            setRegistrations(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const getStudentResults = async () => {
      try {
          const response = await axios.get(`http://127.0.0.1:8000/api/students/${id}/results/`);
          const data = response.data;
          setResults(data);
          setLoading(false);
      } catch (error) {
          setError(error.message);
          setLoading(false);
      }
  };
    useEffect(() => {
        getStudent();
        getStudentRegistrations();
        getStudentResults();
    }, []);

    const handleEditClick = () => {
        navigate(`/edit-student/${id}`);
    };
    const handleResultClick = () => {
      navigate(`/add-result/?studentId=${id}&studentName=${student.first_name} ${student.middle_name} ${student.last_name}`);
    };
    const handleRegistrationClick = () => {
      navigate(`/register-course/?studentId=${id}&studentName=${student.first_name} ${student.middle_name} ${student.last_name}`);
    };

     // Helper function to classify CGPA
    const classifyCGPA = (cgpa) => {
        if (cgpa >= 3.60 && cgpa <= 4.00) {
            return 'First Class Student';
        } else if (cgpa >= 3.00 && cgpa < 3.60) {
            return 'Second Class Upper Student';
        } else if (cgpa >= 2.00 && cgpa < 3.00) {
            return 'Second Class Lower Student';
        } else if (cgpa >= 1.00 && cgpa < 2.00) {
            return 'Third Class Student';
        } else {
            return 'Failed Student';
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

      const deleteResult = async (resultId) => {
        try {
          const csrfToken = getCookie('csrftoken');
      
          const response = await fetch(`http://127.0.0.1:8000/api/results/${resultId}/delete/`, {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
            }
          });
      
          if (response.status === 204) {
            setResults((prevResults) =>
              prevResults.filter((result) => result.id !== resultId)
            );
            setDeletionStatus('Student deleted successfully');
          } else {
            console.error('Failed to delete student. Server returned:', response.status);
          }
        } catch (error) {
          console.error('Error deleting student', error);
        }
      };

      const deleteRegistration = async (registrationId) => {
        try {
            const csrfToken = getCookie('csrftoken');
            const response = await fetch(`http://127.0.0.1:8000/api/registrations/${registrationId}/delete/`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
            });
    
            if (response.status === 204) {
                setRegistrations((prevRegistrations) =>
                    prevRegistrations.filter((registration) => registration.id !== registrationId)
                );
                setDeletionStatus('Registration deleted successfully');
                window.location.reload();  // Reload the page
            } else {
                console.error('Failed to delete registration. Server returned:', response.status);
            }
        } catch (error) {
            console.error('Error deleting registration', error);
        }
    };
    
    

      // Helper function to group results by level and semester
function groupByLevelAndSemester(results) {
  const groupedResults = [];
  results.forEach((result) => {
    const existingGroup = groupedResults.find(
      (group) => group.level === result.course_level && group.semester === result.course_semester
    );

    if (existingGroup) {
      existingGroup.results.push(result);
    } else {
      groupedResults.push({
        level: result.course_level,
        semester: result.course_semester,
        results: [result],
      });
    }
  });

  return groupedResults;
}

    return (
      <div>
      <section style={{ backgroundColor: '#eee' }}>
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-4">
              <div className="card mb-4">
                <div className="card-body text-center">
                  <img
                    src={student.profile_pic || 'https://via.placeholder.com/150'}
                    alt={`${student.first_name} ${student.middle_name} ${student.last_name}`}
                    className="rounded-circle img-fluid"
                    style={{ width: '150px' }}
                  />
                  <h5 className="my-3">
                    {`${student.first_name} ${student.middle_name} ${student.last_name}`}
                  </h5>
                  <div className="d-flex justify-content-center mb-2">
                    <button className="btn btn-outline-primary ms-1" onClick={handleEditClick}>
                      Edit
                    </button>
                    {/* <button className="btn btn-outline-danger ms-1" onClick={() => deleteStudent(student.id)}>
                      Delete
                    </button> */}
                  </div>
                </div>
              </div>
              <hr />
              <div className="card mb-4">
              <div className="card-body">
    <h5 className="card-title">Courses Registered</h5>
    {loading ? (
        <p className="text-muted">Loading...</p>
    ) : error ? (
        <p className="text-danger">Error: {error}</p>
    ) : registrations.length === 0 ? (
        <p className="text-info">No courses registered.</p>
    ) : (
        <ul className="list-group">
            {registrations.map((registration) => (
                   <li className="list-group-item" key={registration.id}>
                   <div className="d-flex justify-content-between align-items-center">
                       <span>
                           <strong>{registration.course_code}</strong> - {registration.course_title}
                       </span>
                    {/* Small, stylish, responsive 'x' button */}
                      <button
                            className="btn btn-link text-danger p-0"
                            style={{
                                fontSize: '1.25rem',  // Responsive size
                                textDecoration: 'none',  // Remove underline
                                padding: '0.25rem',      // Add padding for click area
                                border: 'none',          // No border
                                backgroundColor: 'transparent',  // No background
                                cursor: 'pointer',       // Pointer cursor
                                transition: 'color 0.2s ease-in-out', // Smooth color transition on hover
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#ff3333'} // Hover effect
                            onMouseLeave={(e) => e.target.style.color = 'red'}
                            onClick={() => deleteRegistration(registration.id)}
                        >
                            &times;
                        </button>
                   </div>
               </li>
            ))}
        </ul>
    )}

    {/* Register Course Button */}
    <div className="mt-4">
        <button
            className="btn btn-primary"
            onClick={handleRegistrationClick}
        >
            Register Course
        </button>
    </div>
</div>

        </div>
            <hr />
          </div>
                  <div className="col-lg-8">
                      <div className="card mb-4">
                          <div className="card-body">
                              <div className="row mb-3">
                                  <div className="col-sm-3">
                                      <p className="mb-0">Full Name</p>
                                  </div>
                                  <div className="col-sm-9">
                                      <p className="text-muted mb-0">
                                          {student.first_name} {student.middle_name} {student.last_name}
                                      </p>
                                  </div>
                              </div>
                              <hr />
                              <div className="row mb-3">
                                  <div className="col-sm-3">
                                      <p className="mb-0">Student ID</p>
                                  </div>
                                  <div className="col-sm-9">
                                      <p className="text-muted mb-0">{student.student_id}</p>
                                  </div>
                              </div>
                              <hr />
                              <div className="row mb-3">
                                  <div className="col-sm-3">
                                      <p className="mb-0">Gender</p>
                                  </div>
                                  <div className="col-sm-9">
                                      <p className="text-muted mb-0">{student.gender}</p>
                                  </div>
                              </div>
                              <hr />
                              <div className="row mb-3">
                                  <div className="col-sm-3">
                                      <p className="mb-0">Date of Birth</p>
                                  </div>
                                  <div className="col-sm-9">
                                      <p className="text-muted mb-0">{student.date_of_birth}</p>
                                  </div>
                              </div>
                              <hr />
                              <div className="row mb-3">
                                  <div className="col-sm-3">
                                      <p className="mb-0">Age</p>
                                  </div>
                                  <div className="col-sm-9">
                                      <p className="text-muted mb-0">{student.age}</p>
                                  </div>
                              </div>
                              <hr />
                              <div className="row mb-3">
                                  <div className="col-sm-3">
                                      <p className="mb-0">Department</p>
                                  </div>
                                  <div className="col-sm-9">
                                      <p className="text-muted mb-0">{student.department_name}</p>
                                  </div>
                              </div>
                              <hr />
                              <div className="row mb-3">
                                  <div className="col-sm-3">
                                      <p className="mb-0">Admission Year</p>
                                  </div>
                                  <div className="col-sm-9">
                                      <p className="text-muted mb-0">{student.admission_year}</p>
                                  </div>
                              </div>
                              <hr />
                              <div className="row mb-3">
                                  <div className="col-sm-3">
                                      <p className="mb-0">Level</p>
                                  </div>
                                  <div className="col-sm-9">
                                      <p className="text-muted mb-0">{student.level}</p>
                                  </div>
                              </div>
                              <hr />
                              <div className="row mb-3">
                                  <div className="col-sm-3">
                                      <p className="mb-0">Email</p>
                                  </div>
                                  <div className="col-sm-9">
                                      <p className="text-muted mb-0">{student.email}</p>
                                  </div>
                              </div>
                              <hr />
                              <div className="row">
                                  <div className="col-sm-3">
                                      <p className="mb-0">Phone Number</p>
                                  </div>
                                  <div className="col-sm-9">
                                      <p className="text-muted mb-0">{student.phone_number}</p>
                                  </div>
                              </div>
                        
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="row">
  <div className="col">
    <h5 className="card-title">Results</h5>
    {loading ? (
      <p className="text-muted">Loading...</p>
    ) : error ? (
      <p className="text-danger">Error: {error}</p>
    ) : results && results.length === 0 ? (
      <p className="text-info">No results released.</p>
    ) : (
      <>
     {groupByLevelAndSemester(results).map((group) => {
  // Sort results by date in ascending order (oldest to newest)
  const sortedResults = group.results.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Take the CGPA from the most recent result
  const latestCGPA = sortedResults.length > 0 ? sortedResults[sortedResults.length - 1].cgpa : null;
          return (
            <div key={`${group.level}-${group.semester}`}>
              <h6>Level {group.level}, Semester {group.semester}</h6>
              <strong>
                                                    <h4>
                                                        CGPA: {latestCGPA} ({classifyCGPA(latestCGPA)})
                                                    </h4>
                                                </strong>
              
              <table className="table table-bordered table-hover">
                <thead className="table-primary">
                  <tr>
                    <th>Course Code</th>
                    <th>Course Title</th>
                    <th>Score (%)</th>
                    <th>Grade</th>
                    <th>GPT</th>
                   
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {group.results.map((result) => (
                    <tr key={result.id}>
                      <td>{result.course_code}</td>
                      <td>{result.course_title}</td>
                      <td>{result.score}</td>
                      <td>{result.grade}</td>
                      <td>{result.gpt}</td>
                     
                      {/* Don't display CGPA as a column here */}
                      <td>
                        <button
                          className="btn btn-outline-primary ms-1"
                          onClick={() =>
                            navigate(`/edit-result/${result.id}`)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger ms-1"
                          onClick={() => deleteResult(result.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </>
    )}


<button
  className="btn btn-outline-success ms-1"
  onClick={handleResultClick}
>
  Add Result
</button>


  </div>
</div>
      </div>
    </section>
  </div>
);
};


export default StudentProfilePage;
