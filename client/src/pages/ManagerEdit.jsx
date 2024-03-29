import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';
import ErrorModal from '../components/ErrorModal';

// Define the UpdateManager component to edit a manager
const UpdateManager = () => {
  const { id } = useParams();
  const [managers, setManager] = useState([]);
  const [roles, setRoles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const managerId = location.pathname.split('/')[2];

  // Check if user is logged in before rendering the component and fetch the manager data
  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/');
    }
    getSingleManager(managerId);
    getAllRoles();
  }, [navigate]);

  // Define a function to fetch a single manager by ID
  const getSingleManager = async (managerId) => {
    try {
      const response = await axios.get(`/api/managers/${managerId}`);
      setManager(response.data);
    } catch (error) {
      console.error('Error fetching manager:', error);
    }
  };

  // Define a function to fetch all roles from the API
  const getAllRoles = async () => {
    try {
      const response = await axios.get('/api/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // Define a function to edit a manager
  const editManager = async (managerId, managers) => {
    try {
      await axios.put(`/api/managers/${managerId}`, managers);
      navigate('/managers');
    } catch (error) {
      console.error('Error updating manager:', error);
      throw error;
    }
  };

  // Define a function to handle input change
  const handleChange = (e) => {
    setManager((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Define a function to handle the form submission
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await editManager(managerId, managers);
      navigate('/managers');
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

  // Render the UpdateManager component with a form to edit a manager
  return (
    <div className='container col-md-6 mt-3'>
      <h2 className='text-center'>Edit Manager</h2>
      <form className='form-card mt-3'>
        <div className='mb-3 mt-3'>
          <label className='form-label' htmlFor='id'>ID:</label>
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
          <label className='form-label' htmlFor='first_name'>First Name:</label>
          <input
            type='text'
            className='form-control'
            id='first_name'
            placeholder='Enter First Name'
            name='first_name'
            value={managers.first_name}
            onChange={handleChange}
            autoComplete='on'
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label' htmlFor='last_name'>Last Name:</label>
          <input
            type='text'
            className='form-control'
            id='last_name'
            placeholder='Enter Last Name'
            name='last_name'
            value={managers.last_name}
            onChange={handleChange}
            autoComplete='on'
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label' htmlFor='email'>Email:</label>
          <input
            type='email'
            className='form-control'
            id='email'
            placeholder='Enter Email'
            name='email'
            value={managers.email}
            onChange={handleChange}
            autoComplete='on'
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label' htmlFor='role_id'>Role Title:</label>
          <select
            type='number'
            className='form-select'
            id='role_id'
            placeholder='Select Role'
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
      <ErrorModal
        errorMessage={errorMessage}
        closeModal={closeErrorModal}
        showModal={showErrorModal}
        entityType='managers'
        entityAction='edit'
      />
    </div>
  );
};

export default withAuth(UpdateManager);
