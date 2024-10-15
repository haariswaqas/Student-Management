import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LecturerList = () => {
  const [lecturers, setLecturers] = useState([]);
  const [deletionStatus, setDeletionStatus] = useState(false);


  useEffect(() => {
    getLecturers();
  }, []);

  const getLecturers = async () => {
    try {
      let response = await fetch(`http://127.0.0.1:8000/api/lecturers/`);
      let data = await response.json();
      setLecturers(data);
      setDeletionStatus(null);
    } catch (error) {
      console.error('Error fetching lecturers', error);
    }
  };

  // Group lecturers by their departments
  const lecturersByDepartment = lecturers.reduce((acc, lecturer) => {
    const department = lecturer.department_name;
    if (!acc[department]) {
      acc[department] = [];
    }
    acc[department].push(lecturer);
    return acc;
  }, {});

  return (
    <div className="container mt-4">
      <h2 className="text-white">SES Lecturers</h2>
      {deletionStatus && <div className="alert alert-success">{deletionStatus}</div>}
      {Object.entries(lecturersByDepartment).map(([department, departmentLecturers]) => (
        <div key={department}>
          <h3>{department} Lecturers</h3>
          <div className="row">
            {departmentLecturers.map((lecturer) => (
              <div key={lecturer.id} className="col-md-4 mb-4">
                <div className="card" style={{ maxWidth: '300px' }}>
                  <img
                    src={lecturer.profile_pic} // Replace with the actual URL of the profile picture
                    alt={`${lecturer.first_name} ${lecturer.last_name}`}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link
                        to={`/lecturer/${lecturer.id}`}
                        className="text-dark"
                        style={{ textDecoration: 'none' }}
                      >
                        {`${lecturer.title}. ${lecturer.first_name} ${lecturer.middle_name || ''} ${lecturer.last_name}`}
                      </Link>
                    </h5>
                    <p className="card-text"><strong>Email: </strong>{lecturer.email}</p>
                    <p className="card-text"><strong>Contact: </strong>{lecturer.phone_number}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LecturerList;
