import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';

const UpdateDepartment = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const departmentId = location.pathname.split('/')[2];

  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/');
      return;
    }

    axios.get(`/api/departments/${departmentId}`)
      .then(response => {
        setDepartment(response.data);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });
  }, [navigate]);

  const handleChange = (e) => {
    setDepartment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/departments/${departmentId}`, department);
      navigate('/departments');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='container col-md-6 mt-3'>
      <h2 className='text-center'>Edit Department</h2>
      <form className='form-card mt-3'>
        <div className='mb-3 mt-3'>
          <label className='form-label'>Department ID:</label>
          <input
            type='integer'
            className='form-control'
            id='id'
            placeholder='Enter ID'
            name='id'
            value={id}
            disabled
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label'>Department:</label>
          <input
            type='text'
            className='form-control'
            id='name'
            placeholder='Enter Department Name'
            name='name'
            value={department.name}
            onChange={handleChange}
          />
        </div>
        <button type='submit' className='btn btn-primary' onClick={handleClick}>
          Update
        </button>
      </form>
    </div>
  );
};

export default withAuth(UpdateDepartment);
