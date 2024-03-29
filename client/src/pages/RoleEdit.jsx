import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';
import ErrorModal from '../components/ErrorModal';

// Define the UpdateRole component to edit a role
const UpdateRole = () => {
  const { id } = useParams();
  const [role, setRole] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const roleId = location.pathname.split('/')[2];

  // Check if user is logged in before rendering the component and fetch the role data
  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/');
    }
    getSingleRole(roleId);
    getAllDepartments();
  }, [navigate]);

  // Define a function to fetch a single role by ID
  const getSingleRole = async (roleId) => {
    try {
      const response = await axios.get(`/api/roles/${roleId}`);
      setRole(response.data);
    } catch (error) {
      console.error('Error fetching role:', error);
    }
  };

  // Define a function to fetch all departments
  const getAllDepartments = async () => {
    try {
      const response = await axios.get('/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  // Define a function to edit a role
  const editRole = async () => {
    try {
      const response = await axios.put(`/api/roles/${roleId}`, role);
      return response.data;
    } catch (error) {
      console.error('Failed to edit role:', error);
      throw error;
    }
  };

  // Define a function to handle changes to the input fields
  const handleChange = (e) => {
    setRole((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Define a function to handle the form submission
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await editRole();
      navigate('/roles');
    } catch (error) {
      const errorMessageText = Array.isArray(error.message) ? error.message.join('\n') : error.message;
      setErrorMessage(errorMessageText);
      setShowErrorModal(true);
    }
  };

  // Define a function to close the error modal
  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  // Render the UpdateRole component with a form to edit a role and a modal to display errors
  return (
    <div className='container col-md-6 mt-3'>
      <h2 className='text-center'>Edit Role</h2>
      <form className='form-card mt-3'>
        <div className='mb-3 mt-3'>
          <label className='form-label' htmlFor='id'>Role ID:</label>
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
          <label className='form-label' htmlFor='title'>Role Title:</label>
          <input
            type='text'
            className='form-control'
            id='title'
            placeholder='Enter Title'
            name='title'
            value={role.title}
            onChange={handleChange}
            autoComplete='on'
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label' htmlFor='department_id'>Department:</label>
          <select
            className='form-select'
            id='department_id'
            name='department_id'
            value={role.department_id}
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
      <ErrorModal
        errorMessage={errorMessage}
        closeModal={closeErrorModal}
        showModal={showErrorModal}
        entityType='roles'
        entityAction='edit'
      />
    </div>
  );
};

export default withAuth(UpdateRole);
