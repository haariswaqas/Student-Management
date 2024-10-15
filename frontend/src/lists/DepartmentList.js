import React, { useState, useEffect } from 'react';


const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    getDepartments();
  }, []);

  let getDepartments = async () => {
    try {
      let response = await fetch(`http://127.0.0.1:8000/api/departments/`);
      let data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  return (
    <div>
     
      <div className="container mt-4">
        <h2>Departments</h2>
        <div className="row">
          {departments.map((department) => (
            <div key={department.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{department.name} ({department.code})</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentList;
