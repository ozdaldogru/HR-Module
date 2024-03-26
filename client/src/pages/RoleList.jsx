import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';
import DeleteModal from '../components/DeleteModal';
import { CSVLink } from "react-csv";

function RoleList() {
  const [roles, setRoles] = useState([]);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/');
      return;
    }

    getRoles();
  }, [navigate]);

  const getRoles = async () => {
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

  const Filter = (event) => {
    setRoles(records.filter(role =>
      role.title.toLowerCase().includes(event.target.value) ||
      role.department.name.toLowerCase().includes(event.target.value)

    ))
  }

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setErrorMessage('');
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.get(`/api/roles/${deleteId}`);
      const role = response.data;
      if (role.employees && role.employees.length > 0) {
        setErrorMessage(
          <div>
            <p>{`Cannot delete ${role.title} role. Please remove associated employee(s) first:`}</p>
            <ul>
              {role.employees.map((employee, index) => (
                <li key={index}>{`${employee.first_name} ${employee.last_name}`}</li>
              ))}
            </ul>
          </div>
        );
      } else {
        await deleteRole();
      }
    } catch (error) {
      console.error('Error fetching role details:', error);
      setErrorMessage('Failed to fetch role details. Please try again later.');
    }
  };

  const deleteRole = async () => {
    try {
      await axios.delete(`/api/roles/${deleteId}`);
      setRoles(roles => roles.filter(role => role.id !== deleteId));
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting role:', error);
      setErrorMessage('Failed to delete role. Please try again later.');
    }
  };

  if (isLoading) {
    return <h3 className='text-center m-3'>Loading...</h3>;
  }

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
        />
        <table className='table table-bordered table-hover'>
          <thead>
            <tr>
              <th>Role ID</th>
              <th>Role Title</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>{role.id}</td>
                <td>{role.title}</td>
                <td>{role.department.name}</td>
                <td>
                  <Link to={`/roles/` + role.id} className='btn btn-info btn-sm me-2'>Edit</Link>
                  <button className='btn btn-warning btn-sm' onClick={() => handleDelete(role.id)}>Delete</button>
                </td>
              </tr>
            ))}
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
      />
    </div>
  );
}

export default withAuth(RoleList);
