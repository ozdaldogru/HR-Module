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

  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate('/');
      return;
    }

    axios.get('/api/employees')
      .then(response => {
        setEmployees(response.data);
        setRecords(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
        setIsLoading(false);
      });
  }, [navigate]);

  const Filter = (event) => {
    setEmployees(records.filter(employee =>
      employee.first_name.toLowerCase().includes(event.target.value) ||
      employee.last_name.toLowerCase().includes(event.target.value) ||
      employee.email.toLowerCase().includes(event.target.value) ||
      employee.role.title.toLowerCase().includes(event.target.value)

    ))
  }

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    axios.delete(`api/employees/${deleteId}`)
      .then(() => {
        setEmployees(employees => employees.filter(employee => employee.id !== deleteId));
        setShowModal(false);
      })
      .catch(error => {
        console.error('Error deleting employee:', error);
        setShowModal(false);
        // window.alert('Failed to delete employee. Please try again later.');
      });
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
        <h2>Employee List</h2>
      </div>
      <div className='d-flex justify-content-between'>
        <Link to='add' className='btn btn-success'>Add Employee</Link>
        <CSVLink className='btn btn-dark' data={employees}>Export To CSV</CSVLink>
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
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.first_name}</td>
                <td>{employee.last_name}</td>
                <td>{employee.email}</td>
                <td>{employee.role.title}</td>
                <td>{employee.salary}</td>
                <td>
                  <Link to={`/employees/` + employee.id} className='btn btn-info btn-sm me-2'>Edit</Link>
                  <button className='btn btn-warning btn-sm' onClick={() => handleDelete(employee.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DeleteModal
        showModal={showModal}
        cancelDelete={cancelDelete}
        confirmDelete={confirmDelete}
        entityType="employees"
      />
    </div>
  );
}

export default withAuth(EmployeeList);
