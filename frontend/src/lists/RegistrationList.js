import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, ListGroup, Alert } from 'react-bootstrap';

const RegistrationList = () => {
    const [registrations, setRegistrations] = useState([]);
    const [error, setError] = useState(null);
    const [expandedCourses, setExpandedCourses] = useState({});

    useEffect(() => {
        // Fetch the list of registrations when the component mounts
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/registrations/');
            const data = response.data;
            setRegistrations(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const toggleExpansion = (course) => {
        setExpandedCourses(prev => ({
            ...prev,
            [course]: !prev[course], // Toggle the expanded state for the selected course
        }));
    };

    if (error) {
        return <Alert variant="danger">Error: {error}</Alert>;
    }

    if (registrations.length === 0) {
        return <Alert variant="info">No registrations found.</Alert>;
    }

    // Group registrations by course
    const groupedByCourse = registrations.reduce((acc, registration) => {
        const courseKey = `${registration.course_code} - ${registration.course_title}`;
        if (!acc[courseKey]) {
            acc[courseKey] = [];
        }
        acc[courseKey].push(registration);
        return acc;
    }, {});

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Registration List</h2>
            {Object.entries(groupedByCourse).map(([course, registrations]) => (
                <Card key={course} className="mb-3 shadow-sm">
                    <Card.Header as="h5" className="text-center">
                        <button 
                            className="btn btn-link text-decoration-none" 
                            onClick={() => toggleExpansion(course)} 
                            aria-expanded={expandedCourses[course]}
                            style={{ display: 'flex', alignItems: 'center', fontSize: '1rem' }}
                        >
                            <i
                                className={`bi bi-caret-${expandedCourses[course] ? 'down' : 'right'}-fill toggle-icon`}
                                style={{ fontSize: '1rem', marginRight: '0.5rem' }}
                            ></i>
                            {course}
                        </button>
                    </Card.Header>
                    {expandedCourses[course] && (
                        <ListGroup variant="flush">
                            {registrations.map((registration) => (
                                <ListGroup.Item key={registration.id} className="d-flex justify-content-between align-items-center">
                                    <span>
                                        {registration.student_first_name} {registration.student_middle_name} {registration.student_last_name}
                                    </span>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Card>
            ))}
        </div>
    );
};

export default RegistrationList;
