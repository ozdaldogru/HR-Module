import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';
import ErrorModal from '../components/ErrorModal';

// Define the AddRole component to add a new role
const AddRole = () => {
  const [roles, setRole] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in before rendering the component and fetch the list of departments
  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/');
    }
    getAllDepartments();
  }, [navigate]);

  // Define a function to fetch all departments from the API
  const getAllDepartments = async () => {
    try {
      const response = await axios.get('/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  // Define a function to add a new role
  const addNewRole = async () => {
    try {
      const response = await axios.post('/api/roles/', roles);
      return response.data;
    } catch (error) {
      console.error('Failed to add role:', error);
      throw error;
    }
  };

  // Define a function to handle changes in the input fields
  const handleChange = (e) => {
    setRole((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Define a function to handle the form submission
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await addNewRole();
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

  // Render the AddRole component with a form to add a new role
  return (
    <div className='container col-md-6 mt-3'>
      <h2 className='text-center'>Add Role</h2>
      <form className='form-card mt-3'>
        <div className='mb-3 mt-3'>
          <label className='form-label' htmlFor='title'>Role Title:</label>
          <input
            type='text'
            className='form-control'
            id='title'
            placeholder='Enter Role Title'
            name='title'
            value={roles.title}
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
            value={roles.department_id}
            onChange={handleChange}
          >
            <option value='' disabled selected>Select Department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
        <button type='submit' className='btn btn-primary' onClick={handleClick}>Add Role</button>
      </form>
      <ErrorModal
        errorMessage={errorMessage}
        closeModal={closeErrorModal}
        showModal={showErrorModal}
        entityType='roles'
        entityAction='add'
      />
    </div>
  );
};

export default withAuth(AddRole);
