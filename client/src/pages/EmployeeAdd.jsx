import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';

const AddEmployee = () => {
  const [employees, setEmployee] = useState([]);
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
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setEmployee((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/employees/', employees);
      navigate('/employees');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='container col-md-6 mt-3'>
      <h2 className='text-center'>Add Employee</h2>
      <form className='form-card mt-3'>
        <div className='mb-3 mt-3'>
          <label className='form-label'>First Name:</label>
          <input
            type='text'
            className='form-control'
            id='first_name'
            placeholder='Enter First Name'
            onChange={handleChange}
            name='first_name'
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label'>Last Name:</label>
          <input
            type='text'
            className='form-control'
            id='last_name'
            placeholder='Enter Last Name'
            onChange={handleChange}
            name='last_name'
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label'>Email:</label>
          <input
            type='email'
            className='form-control'
            id='email'
            placeholder='Enter Email'
            autoComplete='off'
            onChange={handleChange}
            name='email'
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label'>Role Title:</label>
          <select
            className='form-select'
            id='role_id'
            onChange={handleChange}
            name='role_id'
            value={employees.role_id}
          >
            <option value='' disabled selected>Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.title}</option>
            ))}
          </select>
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label'>Salary:</label>
          <input
            type='number'
            className='form-control'
            id='salary'
            placeholder='Enter Salary'
            autoComplete='off'
            onChange={handleChange}
            name='salary'
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label'>Manager:</label>
          <div className="form-check">
            <input
              type='checkbox'
              className='form-check-input'
              id='is_manager'
              onChange={handleChange}
              name='is_manager'
              checked={employees.is_manager}
            />
            <label className='form-check-label' htmlFor='is_manager'>Yes</label>
          </div>
        </div>
        <button type='submit' className='btn btn-primary' onClick={handleClick}>Add Employee</button>
      </form>
    </div>
  );
};

export default withAuth(AddEmployee);
