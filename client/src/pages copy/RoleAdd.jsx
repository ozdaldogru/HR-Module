import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';

const AddRole = () => {
  const [roles, setRole] = useState([]);
  const [departments, setDepartments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/');
    }

    axios.get('/api/departments')
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });
  }, [navigate]);

  const handleChange = (e) => {
    setRole((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/roles/', roles);
      navigate('/roles');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='container col-md-6 mt-3'>
      <h2 className='text-center'>Add Role</h2>
      <form className='form-card mt-3'>
        <div className='mb-3 mt-3'>
          <label className='form-label'>Role Title:</label>
          <input
            type='text'
            className='form-control'
            id='title'
            placeholder='Enter Role Title'
            name='title'
            value={roles.title}
            onChange={handleChange}
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label'>Department:</label>
          <select
            className='form-select'
            id='department_id'
            name='department_id'
            value={roles.department_id}
            onChange={handleChange}
          >
            <option value='' disabled selected>Select Department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
        <button type='submit' className='btn btn-primary' onClick={handleClick}>Add Role</button>
      </form>
    </div>
  );
};

export default withAuth(AddRole);
