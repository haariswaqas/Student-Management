import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [deletionStatus, setDeletionStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch projects from the API
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/projects/');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Group Projects by course code and title
  const groupedProjects = {};
  projects.forEach((project) => {
    const key = `${project.course_code} - ${project.course_title}`;

    if (!groupedProjects[key]) {
      groupedProjects[key] = [];
    }
    groupedProjects[key].push(project);
  });

  // Toggle the visibility of projects in a group
  const toggleGroup = (key) => {
    setExpandedGroups({
      ...expandedGroups,
      [key]: !expandedGroups[key],
    });
  };

  const handleDeleteClick = async (projectId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 204) {
        // Project deleted successfully, update the UI or reload assignments
        fetchProjects();
      } else {
        console.error(`Failed to delete project. Server returned:`, response.status);
      }
    } catch (error) {
      console.error(`Error deleting project`, error);
    }
  };

  const handleEditClick = (id) => {
    navigate(`/edit-project/${id}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mt-5 text-center">PROJECTS</h2>
      {Object.keys(groupedProjects).length === 0 ? (
        <div className="alert alert-info">
          No Projects Due. Please come back later.
        </div>
      ) : (
        Object.keys(groupedProjects).map((key) => (
          <div key={key}>
            <button
              className={`btn btn-link toggle-button ${expandedGroups[key] ? 'expanded' : ''}`}
              onClick={() => toggleGroup(key)}
              style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', fontSize: '1.5rem' }}
            >
              <i
                className={`bi bi-caret-${expandedGroups[key] ? 'down' : 'right'}-fill toggle-icon`}
                style={{ fontSize: '1rem', marginRight: '0.5rem' }}
              ></i>
              <h4 style={{ fontWeight: 'bold' }}>{key}</h4>
            </button>
            {expandedGroups[key] && (
              <div>
                {groupedProjects[key].map((project) => (
                  <div key={project.id} className="card mb-4">
                    <div className="card-header" style={{ backgroundColor: '#0055A4' }}>
                      <h5 className="card-title-light text-white">{project.course.course_title}</h5>
                    </div>
                    <div className="card-body bg-dark text-white">
                      <div className="assignment-content mb-3">
                        <h6 className="mb-2">PROJECT {project.project_number} ({project.project_type})</h6>
                        <p>{project.content}</p>
                      </div>
                      <div className="row">
                        <div className="col-md-10">
                          <span className="mb-1"><strong>Date Assigned:</strong> {project.assigned_on}</span>
                          <p className="mb-1"><strong>Due:</strong> {project.due_date}</p>
                        </div>
                        <div className="col-md-7">
                          <p className="mb-1"><strong>Assigned By:</strong> {project.lecturer_title}. {project.lecturer_last_name}</p>
                        </div>
                        <div className="col-md-5">
                          {/* Add Edit and Delete Buttons */}
                          <div className="mt-3 text-right" style={{ marginLeft: '5px' }}>
                            <button
                              className="btn btn-primary mr-2"
                              onClick={() => handleEditClick(project.id)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeleteClick(project.id)}
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

export default Project;
