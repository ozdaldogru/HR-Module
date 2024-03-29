import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';
import ErrorModal from '../components/ErrorModal';

// Define the UpdateEmployee component to edit an employee
const UpdateEmployee = () => {
  const { id } = useParams();
  const [employees, setEmployee] = useState([]);
  const [roles, setRoles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const employeeId = location.pathname.split('/')[2];

  // Check if user is logged in before rendering the component and fetch the employee data
  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/');
    }
    getSingleEmployee(employeeId);
    getAllRoles();
  }, [navigate]);

  // Define a function to fetch a single employee by ID
  const getSingleEmployee = async (employeeId) => {
    try {
      const response = await axios.get(`/api/employees/${employeeId}`);
      setEmployee(response.data);
    } catch (error) {
      console.error('Error fetching individual employee:', error);
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

  // Define a function to edit an employee
  const editEmployee = async (employeeId, employees) => {
    try {
      const response = await axios.put(`/api/employees/${employeeId}`, employees);
      return response.data;
    } catch (error) {
      console.error('Failed to edit employee:', error);
      throw error;
    }
  };

  // Define a function to handle changes to the input fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setEmployee((prev) => ({ ...prev, [name]: newValue }));
  };

  // Define a function to handle the form submission and edit an employee
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await editEmployee(employeeId, employees);
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

  // Render the UpdateEmployee component with a form to edit an employee
  return (
    <div className='container col-md-6 my-3'>
      <h2 className='text-center'>Edit Employee</h2>
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
            value={employees.first_name}
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
            value={employees.last_name}
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
            value={employees.email}
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
            placeholder='Enter User ID'
            name='role_id'
            value={employees.role_id}
            onChange={handleChange}
          >
            <option value='' disabled>Select Role</option>
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
            name='salary'
            value={employees.salary}
            onChange={handleChange}
            autoComplete='on'
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
        <button type='submit' className='btn btn-primary' onClick={handleClick}>
          Update
        </button>
      </form>
      <ErrorModal
        errorMessage={errorMessage}
        closeModal={closeErrorModal}
        showModal={showErrorModal}
        entityType='employees'
        entityAction='edit'
      />
    </div>
  );
};

export default withAuth(UpdateEmployee);
