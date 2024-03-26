import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';

const UpdateManager = () => {
  const { id } = useParams();
  const [managers, setManager] = useState([]);
  const [roles, setRoles] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const managerId = location.pathname.split('/')[2];

  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/');
    }

    axios.get(`/api/managers/${managerId}`)
      .then((response) => {
        setManager(response.data);
      })
      .catch((error) => {
        console.error('Error fetching manager:', error);
      });

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
      await axios.put(`/api/managers/${managerId}`, managers);
      navigate('/managers');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='container col-md-6 mt-3'>
      <h2 className='text-center'>Edit Manager</h2>
      <form className='form-card mt-3'>
        <div className='mb-3 mt-3'>
          <label className='form-label'> ID:</label>
          <input
            type='number'
            className='form-control'
            id='id'
            placeholder='Enter ID'
            name='id'
            value={id}
            disabled
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label'> First Name: </label>
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
          <label className='form-label'> Last Name: </label>
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
          <label className='form-label'> Email: </label>
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
            type='number'
            className='form-select'
            id='role_id'
            placeholder='Enter User ID'
            name='role_id'
            value={managers.role_id}
            onChange={handleChange}
          >
            <option value='' disabled>Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.title}</option>
            ))}
          </select>
        </div>
        <button type='submit' className='btn btn-primary' onClick={handleClick}>Update</button>
      </form>
    </div>
  );
};

export default withAuth(UpdateManager);
