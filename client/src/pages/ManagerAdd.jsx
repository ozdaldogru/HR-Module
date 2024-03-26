import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';

const AddManager = () => {
  const [managers, setManager] = useState([]);
  const [roles, setRoles] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/');
    }

    axios.get('/api/roles')
      .then(response => {
        setRoles(response.data);
      })
      .catch(error => {
        console.error('Error fetching roles:', error);
      });
  }, [navigate]);

  const handleChange = (e) => {
    setManager((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/managers', managers);
      navigate('/managers');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='container col-md-6 mt-3'>
      <h2 className='text-center'>Add Manager</h2>
      <form className='form-card mt-3'>
        <div className='mb-3 mt-3'>
          <label className='form-label'>First Name:</label>
          <input
            type='text'
            className='form-control'
            id='first_name'
            placeholder='Enter First Name'
            name='first_name'
            value={managers.first_name}
            onChange={handleChange}
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label'>Last Name:</label>
          <input
            type='text'
            className='form-control'
            id='last_name'
            placeholder='Enter Last Name'
            name='last_name'
            value={managers.last_name}
            onChange={handleChange}
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label'>Email:</label>
          <input
            type='email'
            className='form-control'
            id='email'
            placeholder='Enter Email'
            name='email'
            value={managers.email}
            onChange={handleChange}
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label'>Role Title:</label>
          <select
            className='form-select'
            id='role_id'
            onChange={handleChange}
            name='role_id'
            value={managers.role_id}
          >
            <option value='' disabled selected>Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.title}</option>
            ))}
          </select>
        </div>
        <button type='submit' className='btn btn-primary' onClick={handleClick}>Add Manager</button>
      </form>
    </div>
  );
};

export default withAuth(AddManager);
