import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Auth from '../utils/auth';
import withAuth from '../components/Auth';
import DeleteModal from '../components/DeleteModal';
import { CSVLink } from "react-csv";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in before rendering the component and fetch the list of employees
  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/');
      return;
    }
    getAllEmployees();
  }, [navigate]);

  // Define a function to fetch all employees from the API
  const getAllEmployees = async () => {
    try {
      const response = await axios.get('/api/employees');
      setEmployees(response.data);
      setRecords(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setIsLoading(false);
    }
  };

  // Define a function to delete an employee
  const deleteEmployee = async () => {
    try {
      await axios.delete(`/api/employees/${deleteId}`);
      setEmployees(employees.filter(employee => employee.id !== deleteId));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  // Define a function to filter the employees based on the search input
  const Filter = (event) => {
    setEmployees(records.filter(employee =>
      employee.first_name.toLowerCase().includes(event.target.value) ||
      employee.last_name.toLowerCase().includes(event.target.value) ||
      employee.email.toLowerCase().includes(event.target.value) ||
      employee.role.title.toLowerCase().includes(event.target.value)
    ))
  };

  // Define a function to confirm the delete operation
  const confirmDelete = () => {
    try {
      deleteEmployee(deleteId);
      setShowModal(false);
    }
    catch (error) {
      console.error('Error during delete operation:', error);
    }
  };

  // Define a function to handle the delete operation
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  // Define a function to cancel the delete operation
  const cancelDelete = () => {
    setShowModal(false);
  };

  // If the data is still loading, display a loading message
  if (isLoading) {
    return <h3 className='text-center m-3'>Loading...</h3>;
  }

  // Return the list of employees in a table format with edit and delete buttons for each employee
  return (
    <div className='px-5 mt-3'>
      <div className='d-flex justify-content-center'>
        <h2>Employee List</h2>
      </div>
      <div className='d-flex justify-content-between'>
        <Link to='add' className='btn btn-success'>Add Employee</Link>
        <CSVLink className='btn btn-dark' data={employees}>Export To CSV</CSVLink>
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
              <th>Employee ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan='7'>No employees found</td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.first_name}</td>
                  <td>{employee.last_name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.role.title}</td>
                  <td>{employee.salary}</td>
                  <td>
                    <Link to={`/employees/${employee.id}`} className='btn btn-info btn-sm me-2'>Edit</Link>
                    <button className='btn btn-warning btn-sm' onClick={() => handleDelete(employee.id)}>Delete</button>
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
        entityType="employees"
        entityNameToDelete={
          deleteId && employees.find(employee => employee.id === deleteId)
            ? `${employees.find(employee => employee.id === deleteId).first_name} ${employees.find(employee => employee.id === deleteId).last_name}`
            : ""
        }
      />
    </div>
  );
}

export default withAuth(EmployeeList);
