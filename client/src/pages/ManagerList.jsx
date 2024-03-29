import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';
import DeleteModal from '../components/DeleteModal';
import { CSVLink } from "react-csv";

function ManagerList() {
  const [managers, setManagers] = useState([]);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/');
      return;
    }
    getAllManagers();
  }, [navigate]);

  const getAllManagers = async () => {
    try {
      const response = await axios.get('/api/managers');
      setManagers(response.data);
      setRecords(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching managers:', error);
      setIsLoading(false);
    }
  };

  const deleteManager = async () => {
    try {
      await axios.delete(`/api/managers/${deleteId}`);
      setManagers(managers.filter(manager => manager.id !== deleteId));
    } catch (error) {
      console.error('Error deleting manager:', error);
    }
  };

  const Filter = (event) => {
    setManagers(records.filter(manager =>
      manager.first_name.toLowerCase().includes(event.target.value) ||
      manager.last_name.toLowerCase().includes(event.target.value) ||
      manager.email.toLowerCase().includes(event.target.value) ||
      manager.role.title.toLowerCase().includes(event.target.value)
    ))
  };

  const confirmDelete = () => {
    try {
      deleteManager();
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting manager:', error);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  if (isLoading) {
    return <h3 className='text-center m-3'>Loading...</h3>;
  }

  return (
    <div className='px-5 mt-3'>
      <div className='d-flex justify-content-center'>
        <h2>Manager List</h2>
      </div>
      <div className='d-flex justify-content-between'>
        <Link to='add' className='btn btn-success'>Add Manager</Link>
        <CSVLink className='btn btn-dark' data={managers}>Export To CSV</CSVLink>
      </div>
      <div className='mt-3 card'>
        <input
          type="text"
          id='searchInput'
          className='form-control'
          placeholder='Type to Search'
          onChange={Filter}
        />
        <table className='table table-bordered table-hover'>
          <thead className='thead table-dark'>
            <tr>
              <th>Manager ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {managers.length === 0 ? (
              <tr>
                <td colSpan='6'>No managers found</td>
              </tr>
            ) : (
              managers.map((manager) => (
                <tr key={manager.id}>
                  <td>{manager.id}</td>
                  <td>{manager.first_name}</td>
                  <td>{manager.last_name}</td>
                  <td>{manager.email}</td>
                  <td>{manager.role.title}</td>
                  <td>
                    <Link to={`/managers/${manager.id}`} className='btn btn-info btn-sm me-2'>Edit</Link>
                    <button className='btn btn-warning btn-sm' onClick={() => handleDelete(manager.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <DeleteModal
        showModal={showModal}
        cancelDelete={cancelDelete}
        confirmDelete={confirmDelete}
        entityType="managers"
        entityNameToDelete={
          deleteId && managers.find(manager => manager.id === deleteId)
            ? `${managers.find(manager => manager.id === deleteId).first_name} ${managers.find(manager => manager.id === deleteId).last_name}`
            : ""
        }
      />
    </div>
  );
}

export default withAuth(ManagerList);
