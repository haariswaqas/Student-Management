import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProjectForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [courses, setCourses] = useState([]);
    const [courseId, setCourseId] = useState('');
    const [projectData, setProjectData] = useState({
        course: '',
        project_number: '',
        content: '',
        assigned_on: '',
        due_date: '',
        project_type: '',
    });

    useEffect(() => {
        if (id) {
            fetchProjectData();
        }

        fetchCourses();
        
    }, [id]);

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

    

    const fetchCourses = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/courses/`);
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchProjectData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/projects/${id}`);
            const data = await response.json();
            setProjectData(data);
        } catch (error) {
            console.error('Error fetching project data', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData({
          ...projectData,
          [name]: value,
        });
      };

    const createOrUpdateProject = async (e) => {
        e.preventDefault();

        try {
           const apiUrl = id
                ? `http://127.0.0.1:8000/api/projects/${id}/update/`
                : 'http://127.0.0.1:8000/api/projects/create/';

            const method = id ? 'PUT' : 'POST';
            const response = await fetch(apiUrl, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify(projectData),
            });

            if (response.status === 200 || response.status === 201) {
                console.log(`Project ${id ? 'changed' : 'added'} successfully`);
                setProjectData({
                    course: '',
                    project_number: '',
                    content: '',
                    assigned_on: '',
                    due_date: '',
                    project_type: '',
                });

                id ? navigate('/projects') : navigate('/projects');
            } else {
              console.error(`Failed to ${id ? 'update' : 'create'} project. Server returned:`, response.status);
              // Handle the error or show an error message to the user
            }
          } catch (error) {
            console.error(`Error ${id ? 'updating' : 'creating'} project`, error);
            // Handle the error or show an error message to the user
          }
    };
return (
    <div className="container mt-4">
  <h2 className="mb-4">{id ? 'Edit' : 'Add'} Project</h2>
  <form onSubmit={createOrUpdateProject}>
    <div className="row">
      <div className="col-md-6">
        <div className="form-group mb-5">
          <select
            className="form-control"
            id="course"
            name="course"
            value={projectData.course}
            onChange={handleChange}
            required
            placeholder="Select a Course"
          >
            <option value="">Select a Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mb-5">
          <input
            type="text"
            className="form-control"
            id="project_number"
            name="project_number"
            value={projectData.project_number}
            onChange={handleChange}
            required
            placeholder="Project No."
          />
        </div>

        <div className="form-group">
          <select
            className="form-control"
            id="project_type"
            name="project_type"
            value={projectData.project_type}
            onChange={handleChange}
            placeholder="Project Type"
          >
            <option value="Group">Group</option>
            <option value="Individual">Individual</option>
          </select>
        </div>
      </div>

      <div className="col-md-6">
        <div className="form-group mb-5">
          <input
            type="datetime-local"
            className="form-control"
            id="due_date"
            name="due_date"
            value={projectData.due_date || ''}
            onChange={handleChange}
            placeholder="Due Date"
          />
        </div>

        <div className="form-group">
          <textarea
            className="form-control"
            id="content"
            name="content"
            value={projectData.content}
            onChange={handleChange}
            required
            placeholder="Content"
          ></textarea>
        </div>
      </div>
    </div>

    <div className="form-group mt-3">
      <button type="submit" className="btn btn-primary">
        {id ? 'Update Project' : 'Add Project'}
      </button>
    </div>
  </form>
</div>
)
      
};

export default ProjectForm;
