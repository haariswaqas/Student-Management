import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const RegisterCourseForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const studentId = queryParams.get('studentId');
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [registrationData, setRegistrationData] = useState({
        student: '',
        course: '',
    });

    // Prefill the student field with studentId and set it as read-only
    useEffect(() => {
        if (studentId) {
            setRegistrationData((prevData) => ({
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
            fetchRegistrationData();
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

    const fetchRegistrationData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/registrations/${id}`);
            const data = await response.json();
            setRegistrationData(data);
        } catch (error) {
            console.error('Error fetching registration data', error);
        }
    };

    const handleStudentChange = (e) => {
        const selectedId = e.target.value;
        setRegistrationData({ ...registrationData, student: selectedId });
        const student = students.find((student) => student.id === selectedId);
        setSelectedStudent(student);
    };

    const handleCourseChange = (e) => {
        const selectedId = e.target.value;
        setRegistrationData({ ...registrationData, course: selectedId });
        const course = courses.find((course) => course.id === selectedId);
        setSelectedCourse(course);
    };

    const createOrUpdateRegistration = async (e) => {
        e.preventDefault();

        // Check if student and course level and department match
        if (
            selectedStudent &&
            selectedCourse &&
            (selectedStudent.level !== selectedCourse.level ||
                selectedStudent.department !== selectedCourse.department)
        ) {
            setErrorMessage(
                'Student level and department must match the course level and department.'
            );
            setSuccessMessage(''); // Clear success message
            return; // Do not proceed with registration if there's a mismatch
        }

        setErrorMessage(''); // Clear any previous error messages

        try {
            const updatedRegistrationData = {
                ...registrationData,
            };

            const apiUrl = id
                ? `http://127.0.0.1:8000/api/registrations/${id}/update/`
                : 'http://127.0.0.1:8000/api/registrations/create/';

            const method = id ? 'PUT' : 'POST';
            const response = await fetch(apiUrl, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify(updatedRegistrationData),
            });

            if (response.status === 200 || response.status === 201) {
                setSuccessMessage(`Course ${id ? 'changed' : 'registered'} successfully!`);
                setErrorMessage(''); // Clear any previous error messages
                setRegistrationData({
                    student: '',
                    course: '',
                });

                // Redirect after successful registration
                setTimeout(() => {
                    navigate(`/student/${registrationData.student}`);
                }, 1000); // 2 seconds delay before redirect
            } else if (response.status === 400) {
                setErrorMessage('The student level or department does not match.');
                setSuccessMessage(''); // Clear success message
            } else {
                console.error(`Failed to ${id ? 'change' : 'register'} course. Server returned:`, response.status);
            }
        } catch (error) {
            console.error(`Error ${id ? 'changing' : 'registering'} course`, error);
        }
    };

    return (
        <div className="container">
            

            {/* Display error message */}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            {/* Display success message */}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <form

                onSubmit={createOrUpdateRegistration}
                className="p-4"
                style={{
                    backgroundColor: '#d1ecf1', // Light blue background
          borderRadius: '8px',
                  
                }}
            ><h2 className="text-center mb-4" style={{ color: '#0c5460' }}>{id ? 'Change' : 'Register'} Course</h2>
                <div className="form-group">
                    <select
                        className="form-control"
                        id="student"
                        name="student"
                        value={registrationData.student}
                        onChange={handleStudentChange}
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
<br></br>
                <div className="form-group">
                    <select
                        className="form-control"
                        id="course"
                        name="course"
                        value={registrationData.course}
                        onChange={handleCourseChange}
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
                <br></br>
                <div className="row">
            <div className="col-md-12 text-center">
              <button type="submit" className="btn btn-primary">
                {id ? 'Save Registration' : 'Save Registration'}
              </button>
            </div>
          </div>
            </form>
        </div>
    );
};

export default RegisterCourseForm;
