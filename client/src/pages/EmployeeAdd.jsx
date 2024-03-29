import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';
import ErrorModal from '../components/ErrorModal';

// Define the AddEmployee component to add a new employee
const AddEmployee = () => {
  const [employees, setEmployee] = useState([]);
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

  // Define a function to add a new employee
  const addNewEmployee = async () => {
    try {
      const response = await axios.post('/api/employees', employees);
      return response.data;
    } catch (error) {
      console.error('Failed to add employee:', error);
      throw error;
    }
  };

  // Define a function to handle changes to the input fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setEmployee((prev) => ({ ...prev, [name]: newValue }));
  };

  // Define a function to handle the form submission and add a new employee
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await addNewEmployee();
      navigate('/employees');
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

  // Render the AddEmployee component with a form to add a new employee
  return (
    <div className='container col-md-6 mt-3'>
      <h2 className='text-center'>Add Employee</h2>
      <form className='form-card mt-3'>
        <div className='mb-3 mt-3'>
          <label className='form-label' htmlFor='first_name'>First Name:</label>
          <input
            type='text'
            className='form-control'
            id='first_name'
            placeholder='Enter First Name'
            onChange={handleChange}
            name='first_name'
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
            onChange={handleChange}
            name='last_name'
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
            autoComplete='on'
            onChange={handleChange}
            name='email'
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label' htmlFor='role_id'>Role Title:</label>
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
          <label className='form-label' htmlFor='salary'>Salary:</label>
          <input
            type='number'
            className='form-control'
            id='salary'
            placeholder='Enter Salary (between 3-10 digits)'
            autoComplete='on'
            onChange={handleChange}
            name='salary'
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label' htmlFor='is_manager'>Manager:</label>
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
      <ErrorModal
        errorMessage={errorMessage}
        closeModal={closeErrorModal}
        showModal={showErrorModal}
        entityType='employees'
        entityAction='add'
      />
    </div>
  );
};

export default withAuth(AddEmployee);
