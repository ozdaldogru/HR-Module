import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';
import ErrorModal from '../components/ErrorModal';

// Define the AddManager component to add a manager
const AddManager = () => {
  const [managers, setManager] = useState([]);
  const [roles, setRoles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in before rendering the component and fetch the list of roles
  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/');
    }
    getAllRoles();
  }, [navigate]);

  // Define a function to fetch all roles from the API
  const getAllRoles = async () => {
    try {
      const response = await axios.get('/api/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // Define a function to add a new manager to the database
  const addNewManager = async () => {
    try {
      const response = await axios.post('/api/managers', managers);
      return response.data;
    } catch (error) {
      console.error('Error adding manager:', error);
      throw error;
    }
  };

  // Define a function to handle changes in the input fields
  const handleChange = (e) => {
    setManager((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Define a function to handle the form submission
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await addNewManager();
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

  // Return the AddManager component with a form to add a new manager
  return (
    <div className='container col-md-6 mt-3'>
      <h2 className='text-center'>Add Manager</h2>
      <form className='form-card mt-3'>
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
      <ErrorModal
        errorMessage={errorMessage}
        closeModal={closeErrorModal}
        showModal={showErrorModal}
        entityType='managers'
        entityAction='add'
      />
    </div>
  );
};

export default withAuth(AddManager);
