import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const LecturerForm = () => {
    const{ id } = useParams();
    const navigate = useNavigate();

    // State forL Lecturer Data and form fields
    const[lecturerData, setLecturerData] = useState({
        lecturer_id: '', 
        title: '',
        first_name: '',
        middle_name: '', 
        last_name: '',
        department: '',
        gender: '', 
        date_of_birth: '',
        office: '', 
        bio: '',
        phone_number: '',
    });

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
    if(id) {
        fetchLecturerData();
    }

  }, [id])

  const fetchLecturerData = async () => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/lecturers/${id}`);
        const data = await response.json();
        setLecturerData(data);
      } catch (error) {
        console.error('Error fetching lecturer data', error);
      }
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setLecturerData({
        ...lecturerData,
        [name]: value,
      });
    };

    const createOrUpdateLecturer = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
      
        try {
          // Determine whether to create or update based on the presence of id
          const apiUrl = id
            ? `http://127.0.0.1:8000/api/lecturers/${id}/update/`
            : 'http://127.0.0.1:8000/api/lecturers/create/';
      
          const method = id ? 'PUT' : 'POST';
      
          const response = await fetch(apiUrl, {
            method,
            headers: {
              'Content-Type': 'application/json',
              'X-Csrftoken': getCookie('csrftoken'),
            },
            body: JSON.stringify(lecturerData),
          });
      
          if (response.status === 200 || response.status === 201) {
            // Successfully created or updated, you can handle success here
            console.log(`Lecturer ${id ? 'updated' : 'created'} successfully`);
            // Clear the form fields after successful submission
            setLecturerData({
                lecturer_id: '', 
                title: '',
                first_name: '',
                middle_name: '', 
                last_name: '',
                department: '',
                gender: '', 
                date_of_birth: '',
                office: '', 
                bio: '',
                phone_number: '',
              // Clear other fields as needed
            });
      
            // Redirect to the student profile page if creating, or navigate to the updated student if editing
            id ? navigate(`/lecturer/${id}`) : navigate('/lecturers');
          } else {
            console.error(`Failed to ${id ? 'update' : 'create'} lecturer. Server returned:`, response.status);
            // Handle the error or show an error message to the user
          }
        } catch (error) {
          console.error(`Error ${id ? 'updating' : 'creating'} lecturer`, error);
          // Handle the error or show an error message to the user
        }
      };  
    
      return (
        <form className="student-form" onSubmit={createOrUpdateLecturer}>
  <div className="container mt-4">
  <h3>
  {id
    ? `${lecturerData.lecturer_id} - ${lecturerData.first_name} ${lecturerData.middle_name ? lecturerData.middle_name + ' ' : ''}${lecturerData.last_name}`
    : 'Create Lecturer'}
</h3>

    <div className="row">
      <div className="col-md-6">
        <div className="form-group">
          <label htmlFor="lecturer_id" className="text-white">
            Lecturer ID
          </label>
          <input
            type="text"
            name="lecturer_id"
            id="lecturer_id"
            className="form-control"
            value={lecturerData.lecturer_id}
            onChange={handleChange}
            required
            placeholder="Enter Lecturer ID"
          />
        </div>
        <div className="form-group">
          <label htmlFor="title" className="text-white">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="form-control"
            value={lecturerData.title}
            onChange={handleChange}
            required
            placeholder="Title: Eg. Dr, Prof, etc.."
          />
        </div>
        <div className="form-group">
          <label htmlFor="first_name" className="text-white">
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            className="form-control"
            value={lecturerData.first_name}
            onChange={handleChange}
            required
            placeholder="Enter First Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="middle_name" className="text-white">
            Middle Name (Optional)
          </label>
          <input
            type="text"
            name="middle_name"
            id="middle_name"
            className="form-control"
            value={lecturerData.middle_name}
            onChange={handleChange}
            placeholder="Enter Middle Name (Optional)"
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name" className="text-white">
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            className="form-control"
            value={lecturerData.last_name}
            onChange={handleChange}
            required
            placeholder="Enter Last Name"
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-group">
          <label htmlFor="department" className="text-white">
            Department
          </label>
          <select
            name="department"
            id="department"
            className="form-control"
            value={lecturerData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            <option value="1">Computer Engineering (CPEN)</option>
            <option value="2">Biomedical Engineering (BMEN)</option>
            <option value="3">Materials Science & Engineering (MTEN)</option>
            <option value="4">Food Process Engineering (FPEN)</option>
            <option value="5">Agricultural Engineering (AREN)</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="gender" className="text-white">
            Gender
          </label>
          <select
            name="gender"
            id="gender"
            className="form-control"
            value={lecturerData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="date_of_birth" className="text-white">
            Date of Birth
          </label>
          <input
            type="date"
            name="date_of_birth"
            id="date_of_birth"
            className="form-control"
            value={lecturerData.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-6">
        <div className="form-group">
          <label htmlFor="office" className="text-white">
            Office
          </label>
          <input
            type="text"
            name="office"
            id="office"
            className="form-control"
            value={lecturerData.office}
            onChange={handleChange}
            required
            placeholder="Enter Office"
          />
        </div>
        <div className="form-group">
          <label htmlFor="bio" className="text-white">
            Bio
          </label>
          <textarea
            name="bio"
            id="bio"
            className="form-control"
            value={lecturerData.bio}
            onChange={handleChange}
            placeholder="Write about yourself"
          ></textarea>
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-group">
          <label htmlFor="phone_number" className="text-white">
            Phone Number
          </label>
          <input
            type="text"
            name="phone_number"
            id="phone_number"
            className="form-control"
            value={lecturerData.phone_number}
            onChange={handleChange}
            placeholder="Enter Phone Number"
            required
          />
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-6">
        <div className="form-group">
          <br></br>
          <button type="submit" className="btn btn-primary">
  {id
    ? `Update ${lecturerData.title}. ${lecturerData.last_name}${lecturerData.last_name.endsWith('s') ? "'" : "'s"} Details`
    : 'Create Lecturer'}
</button>

        </div>
      </div>
    </div>
  </div>
</form>

      );
}

export default LecturerForm;