import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';

const AddDepartment = () => {
  const [departments, setDepartment] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setDepartment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/departments/', departments);
      navigate('/departments');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='container col-md-6 mt-3'>
      <h2 className='text-center'>Add Department</h2>
      <form className='form-card mt-3'>
        <div className='mb-3 mt-3'>
          <label className='form-label'>Department:</label>
          <input
            type='text'
            className='form-control'
            id='name'
            placeholder='Enter Department Name'
            name='name'
            value={departments.name}
            onChange={handleChange}
          />
        </div>
        <button type='submit' className='btn btn-primary' onClick={handleClick}>Add Department</button>
      </form>
    </div>
  );
};

export default withAuth(AddDepartment); // Wrap AddDepartment with withAuth HOC
