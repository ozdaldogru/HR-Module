import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';

const UpdateEmployee = () => {
  const { id } = useParams();
  const [employees, setEmployee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role_id: '',
    salary: '',
    is_manager: false
  });
  const [roles, setRoles] = useState([]);

  const employeeId = location.pathname.split('/')[2];

  const navigate = useNavigate();

  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/');
    }

    axios.get(`/api/employees/${employeeId}`)
      .then(response => {
        setEmployee(response.data);
      })
      .catch(error => {
        console.error('Error fetching employee:', error);
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
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setEmployee((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/employees/${employeeId}`, employees);
      navigate('/employees');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='container col-md-6 my-3'>
      <h2 className='text-center'>Edit Employee</h2>
      <form className='form-card mt-3'>
        <div className='mb-3 mt-3'>
          <label className='form-label'>ID:</label>
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
          <label className='form-label'>First Name:</label>
          <input
            type='text'
            className='form-control'
            id='first_name'
            placeholder='Enter First Name'
            name='first_name'
            value={employees.first_name}
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
            value={employees.last_name}
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
            value={employees.email}
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
            value={employees.role_id}
            onChange={handleChange}
          >
            <option value='' disabled>Select Role</option>
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
            name='salary'
            value={employees.salary}
            onChange={handleChange}
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
        <button type='submit' className='btn btn-primary' onClick={handleClick}>
          Update
        </button>
      </form>
    </div>
  );
};

export default withAuth(UpdateEmployee);
