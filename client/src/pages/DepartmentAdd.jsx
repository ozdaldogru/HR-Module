import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';
import ErrorModal from '../components/ErrorModal';

// Define the AddDepartment component to add a new department
const AddDepartment = () => {
  const [departments, setDepartment] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in before rendering the component
  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  // Define a function to add a new department
  const addNewDepartment = async () => {
    try {
      const response = await axios.post('/api/departments', departments);
      return response.data;
    } catch (error) {
      console.error('Failed to add department:', error);
      throw error;
    }
  };

  // Define a function to handle changes to the input fields
  const handleChange = (e) => {
    setDepartment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Define a function to handle the form submission
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await addNewDepartment();
      navigate('/departments');
    } catch (error) {
      // If error.message is an array, join its elements into a single string separated by newlines
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

  // Render the AddDepartment component with a form to add a new department
  return (
    <div className='container col-md-6 mt-3'>
      <h2 className='text-center'>Add Department</h2>
      <form className='form-card mt-3'>
        <div className='mb-3 mt-3'>
          <label className='form-label' htmlFor='name'>Department:</label>
          <input
            type='text'
            className='form-control'
            id='name'
            placeholder='Enter Department Name'
            name='name'
            value={departments.name}
            onChange={handleChange}
            autoComplete='on'
          />
        </div>
        <button type='submit' className='btn btn-primary' onClick={handleClick}>Add Department</button>
      </form>
      <ErrorModal
        errorMessage={errorMessage}
        closeModal={closeErrorModal}
        showModal={showErrorModal}
        entityType='departments'
        entityAction='add'
      />
    </div>
  );
};

export default withAuth(AddDepartment);
