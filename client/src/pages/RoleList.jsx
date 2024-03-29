import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CSVLink } from "react-csv";
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';
import DeleteModal from '../components/DeleteModal';

// Define the RoleList component to display the list of roles
function RoleList() {
  const [roles, setRoles] = useState([]);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Fetch the list of roles from the API
  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/');
      return;
    }
    getAllRoles();
  }, [navigate]);

  // Define a function to fetch all roles from the API
  const getAllRoles = async () => {
    try {
      const response = await axios.get('/api/roles');
      setRoles(response.data);
      setRecords(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setIsLoading(false);
    }
  };

  // Define a function to filter the roles based on the search input
  const Filter = (event) => {
    setRoles(records.filter(role =>
      role.title.toLowerCase().includes(event.target.value) ||
      role.department.name.toLowerCase().includes(event.target.value)
    ))
  };

  // Define a function to fetch a single role by ID
  const getSingleRole = async (roleId) => {
    try {
      const response = await axios.get(`/api/roles/${roleId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching role:', error);
      throw error;
    }
  };

  // Define a function to delete a role by ID
  const deleteRole = async (deleteId) => {
    try {
      await axios.delete(`/api/roles/${deleteId}`);
      setRoles(roles => roles.filter(role => role.id !== deleteId));
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting role:', error);
      setErrorMessage('Failed to delete role. Please try again later.');
    }
  };

  // Define a function to handle the delete operation
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  // Define a function to confirm the delete operation
  const confirmDelete = async () => {
    try {
      const role = await getSingleRole(deleteId);
      const associatedEmployees = role.employees.map(employee => `${employee.first_name} ${employee.last_name}`);
      if (associatedEmployees.length > 0) {
        setShowModal(true);
        setErrorMessage(
          <div>
            <p>{`Cannot delete ${role.title} role. Please remove associated employee(s) first:`}</p>
            <ul>
              {associatedEmployees.map((employee, index) => (
                <li key={index}>{employee}</li>
              ))}
            </ul>
          </div>
        );
      } else {
        await deleteRole(deleteId);
      }
    } catch (error) {
      console.error('Error during delete operation:', error);
      setShowModal(true);
      setErrorMessage('Failed to fetch role details. Please try again later.');
    }
  };

  // Define a function to cancel the delete operation
  const cancelDelete = () => {
    setShowModal(false);
    setErrorMessage('');
  };

  // If the data is still loading, display a loading message
  if (isLoading) {
    return <h3 className='text-center m-3'>Loading...</h3>;
  }

  // Render the list of roles in a table format with edit and delete buttons for each role
  return (
    <div className='px-5 mt-3'>
      <div className='d-flex justify-content-center'>
        <h2>Roles List</h2>
      </div>
      <div className='d-flex justify-content-between'>
        <Link to='add' className='btn btn-success'>Add Role</Link>
        <CSVLink className='btn btn-dark' data={roles}>Export To CSV</CSVLink>
      </div>
      <div className='mt-3 card'>
        <input
          type="text"
          className='form-control'
          placeholder='Type to Search'
          onChange={Filter}
          id='searchInput'
        />
        <table className='table table-bordered table-hover'>
          <thead className='thead table-dark'>
            <tr>
              <th>Role ID</th>
              <th>Role Title</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan='4'>No roles found</td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id}>
                  <td>{role.id}</td>
                  <td>{role.title}</td>
                  <td>{role.department.name}</td>
                  <td>
                    <Link to={`/roles/${role.id}`} className='btn btn-info btn-sm me-2'>Edit</Link>
                    <button className='btn btn-warning btn-sm' onClick={() => handleDelete(role.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <DeleteModal
        showModal={showModal}
        setShowModal={setShowModal}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        cancelDelete={cancelDelete}
        confirmDelete={confirmDelete}
        entityType='roles'
        entityNameToDelete={roles.find(role => role.id === deleteId)?.title}
      />
    </div >
  );
}

export default withAuth(RoleList);
