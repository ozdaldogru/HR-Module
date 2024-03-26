import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';

const UpdateRole = () => {
  const { id } = useParams();
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const roleId = location.pathname.split('/')[2];

  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/');
    }

    axios.get(`/api/roles/${roleId}`)
      .then(response => {
        setRoles(response.data);
      })
      .catch(error => {
        console.error('Error fetching role:', error);
      });

    axios.get('/api/departments')
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });
  }, [navigate]);

  const handleChange = (e) => {
    setRoles((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/roles/${roleId}`, roles);
      navigate('/roles');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='container col-md-6 mt-3'>
      <h2 className='text-center'>Edit Role</h2>
      <form className='form-card mt-3'>
        <div className='mb-3 mt-3'>
          <label className='form-label'>Role ID:</label>
          <input
            type='text'
            className='form-control'
            id='id'
            placeholder='Enter ID'
            name='id'
            value={id}
            disabled
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label'>Role Title:</label>
          <input
            type='text'
            className='form-control'
            id='title'
            placeholder='Enter Title'
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
            <option value='' disabled>Select Department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
        <button type='submit' className='btn btn-primary' onClick={handleClick}>Update</button>
      </form>
    </div>
  );
};

export default withAuth(UpdateRole);
