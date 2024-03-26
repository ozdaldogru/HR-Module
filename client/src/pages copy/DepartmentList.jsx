import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Auth from "../utils/auth";
import withAuth from "../components/Auth";
import "../styles/Modal.css";

// Define the DepartmentList component to display the list of departments
function DepartmentList() {
  const [, /* roles */ setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Fetch the list of departments from the API
  useEffect(() => {
    // Check if user is logged in before fetching departments
    if (!Auth.loggedIn()) {
      // If user is not logged in, redirect to login page
      navigate("/");
      return;
    }

    axios
      .get("/api/departments")
      .then((departmentResponse) => {
        setDepartments(departmentResponse.data);
        // Fetch roles after departments are fetched
        axios
          .get("/api/roles")
          .then((rolesResponse) => {
            setRoles(rolesResponse.data);
            setIsLoading(false);
          })
          .catch((rolesError) => {
            console.error("Error fetching roles:", rolesError);
            setIsLoading(false);
          });
      })
      .catch((departmentError) => {
        console.error("Error fetching departments:", departmentError);
        setIsLoading(false);
      });
  }, [navigate]);

  const Filter = (event) => {
    setDepartments(
      records.filter((department) =>
        department.name.toLowerCase().includes(event.target.value)
      )
    );
  };

  // Define a function to fetch all departments from the API
  const getAllDepartments = async () => {
    try {
      const response = await axios.get("/api/departments");
      setDepartments(response.data);
      setRecords(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching all departments:", error);
      setIsLoading(false);
    }
  };

  // Define a function to fetch a single department by ID
  const getSingleDepartment = async (deleteId) => {
    try {
      const response = await axios.get(`/api/departments/${deleteId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching individual department:", error);
    }
  };

  // Define a function to delete a department
  const deleteDepartment = async (deleteId) => {
    try {
      await axios.delete(`/api/departments/${deleteId}`);
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  // Define the handleDelete function to show the modal
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  // Define the confirmDelete and cancelDelete functions
  const confirmDelete = () => {
    axios
      .delete(`/api/roles/${deleteId}`)

      //      .delete(`api/departments/${deleteId}`)
      .then(() => {
        // Remove the deleted department from the state
        setDepartments((departments) =>
          departments.filter((department) => department.id !== deleteId)
        );
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error deleting department:", error);
        setShowModal(false);
      });
  };

  // Define the cancelDelete function to close the modal
  const cancelDelete = () => {
    setShowModal(false);
  };

  // Render the modal to confirm delete
  const renderModal = () => {
    return (
      <div className="modal" style={{ display: showModal ? "block" : "none" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Delete</h5>
              <button
                type="button"
                className="btn-close"
                onClick={cancelDelete}
              ></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this department?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If loading, show loading indicator
  if (isLoading) {
    return <h3 className="text-center m-3">Loading...</h3>;
  }

  // Render the list of departments in a table format with edit and delete buttons for each department
  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h2>Departments List</h2>
      </div>
      <Link to="add" className="btn btn-success">
        {" "}
        Add Department
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Department ID</th>
              <th>Department Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department.id}>
                <td>{department.id}</td>
                <td>{department.name}</td>
                <td>
                  <Link
                    to={`/departments/` + department.id}
                    className="btn btn-info btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(department.id)}
                  >
                    Delete
                  </button>
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

// Wrap the DepartmentList component with the withAuth HOC
export default withAuth(DepartmentList);