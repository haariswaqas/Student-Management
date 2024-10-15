import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const LecturerProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lecturer, setLecturer] = useState({});

  const getLecturer = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/lecturers/${id}`);
      const data = await response.json();
      setLecturer(data);
    } catch (error) {
      console.error('Error fetching lecturer profile information', error);
    }
  };

  useEffect(() => {
    getLecturer();
  }, []);

  const handleEditClick = () => {
    navigate(`/edit-lecturer/${id}`);
  };

  return (
    <div>
      <section style={{ backgroundColor: '#eee' }}>
        <div className="container py-5">
          <div className="row">
            <div className="col">
              <nav aria-label="breadcrumb" className="bg-light rounded-3 p-3 mb-4"></nav>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4">
              <div className="card mb-4">
                <div className="card-body text-center">
                  <img
                    src={lecturer.profile_pic || 'https://via.placeholder.com/150'}
                    alt={`${lecturer.first_name} ${lecturer.last_name}`}
                    className="rounded-circle img-fluid"
                    style={{ width: '150px' }}
                  />
                  <h5 className="my-3">
                    {`${lecturer.title}. ${lecturer.first_name} ${lecturer.middle_name || ''} ${lecturer.last_name}`}
                  </h5>
                  
                  <div className="d-flex justify-content-center mb-2">
                    <button className="btn btn-outline-primary ms-1" onClick={handleEditClick}>
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
              <div className="card mb-4 mb-lg-0">
                {/* Add more card content here */}
              </div>
            </div>
            <div className="col-lg-8">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Full Name</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">
                        {`${lecturer.title}. ${lecturer.first_name} ${lecturer.middle_name || ''} ${lecturer.last_name}`}
                      </p>
                    </div>
                  </div>
                  <hr />
                  {/* Add more profile information here */}
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Lecturer ID</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{lecturer.lecturer_id || 'N/A'}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Gender</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{lecturer.gender || 'N/A'}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Date of Birth</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{lecturer.date_of_birth || 'N/A'}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Age</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{lecturer.age || 'N/A'}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Department</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{lecturer.department_name || 'N/A'}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Email</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{lecturer.email}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Phone Number</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{lecturer.phone_number || 'N/A'}</p>
                    </div>
                  </div>
                  <hr />
                 
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Office</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{lecturer.office || 'N/A'}</p>
                    </div>
                  </div>
                  <hr />
                 
                  
                  {/* Add more fields here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LecturerProfilePage;
