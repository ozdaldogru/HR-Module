import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';
import ErrorModal from '../components/ErrorModal';

// Define the UpdateDepartment component to edit a department
const UpdateDepartment = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const departmentId = location.pathname.split('/')[2];

  // Check if user is logged in before rendering the component and fetch the department data
  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/');
      return;
    }
    getSingleDepartment(departmentId);
  }, [navigate]);

  // Define a function to fetch a single department by ID
  const getSingleDepartment = async (departmentId) => {
    try {
      const response = await axios.get(`/api/departments/${departmentId}`);
      setDepartment(response.data);
    } catch (error) {
      console.error('Error fetching department:', error);
    }
  };

  // Define a function to edit a department
  const editDepartment = async () => {
    try {
      const response = await axios.put(`/api/departments/${departmentId}`, department);
      return response.data;
    } catch (error) {
      console.error('Failed to edit department:', error);
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
      await editDepartment();
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

  // Render the UpdateDepartment component with a form to edit a department and an error modal to display any errors
  return (
    <div className='container col-md-6 mt-3'>
      <h2 className='text-center'>Edit Department</h2>
      <form className='form-card mt-3'>
        <div className='mb-3 mt-3'>
          <label className='form-label' htmlFor='id'>Department ID:</label>
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
          <label className='form-label' htmlFor='name'>Department:</label>
          <input
            type='text'
            className='form-control'
            id='name'
            placeholder='Enter Department Name'
            name='name'
            value={department.name}
            onChange={handleChange}
            autoComplete='on'
          />
        </div>
        <button type='submit' className='btn btn-primary' onClick={handleClick}>
          Update
        </button>
      </form>
      <ErrorModal
        errorMessage={errorMessage}
        closeModal={closeErrorModal}
        showModal={showErrorModal}
        entityType='departments'
        entityAction='edit'
      />
    </div>
  );
};

export default withAuth(UpdateDepartment);
