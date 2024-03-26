import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';
import Auth from '../utils/auth';
import '../styles/Navbar.css';

// Define the AppNavbar component to display the navigation bar
const AppNavbar = () => {
  const [showModal, setShowModal] = useState(false); // State to track modal visibility
  const [loggedIn, setLoggedIn] = useState(false); // State to track login status

  useEffect(() => {
    // Update login status when component mounts
    setLoggedIn(Auth.loggedIn()); // Check if user is logged in
  }, []);

  const handleLogin = () => {
    // After successful login, update login status
    setLoggedIn(true); // Set the login status to true
    setShowModal(false); // Close the modal
  };

  const handleLogout = () => {
    // After logout, update login status
    Auth.logout(); // Clear the token from local storage
    setLoggedIn(false); // Set the login status to false
  };

  // Function to close the navbar when a link is clicked
  const handleNavLinkClick = () => {
    if (window.innerWidth < 768) { // Close navbar if screen size is less than to 768px (Bootstrap md breakpoint)
      const navbarToggler = document.querySelector('.navbar-toggler'); // Select the navbar toggler button
      if (navbarToggler) { // If the navbar toggler button is found
        navbarToggler.click(); // Simulate click on navbar toggler button
      }
    }
  };

  return (
    <>
      <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
        <Container fluid>
          <Navbar.Brand>
            Employee Management System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse className='justify-content-end' id='responsive-navbar-nav'>
            <Nav className='ml-auto text-end'>
              {loggedIn && (
                <>
                  <Nav.Link as={Link} to='/departments' onClick={handleNavLinkClick}>
                    Departments
                  </Nav.Link>
                  <Nav.Link as={Link} to='/roles' onClick={handleNavLinkClick}>
                    Roles
                  </Nav.Link>
                  <Nav.Link as={Link} to='/employees' onClick={handleNavLinkClick}>
                    Employees
                  </Nav.Link>
                  <Nav.Link as={Link} to='/managers' onClick={handleNavLinkClick}>
                    Managers
                  </Nav.Link>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              )}
              {!loggedIn && (
                <Nav.Link onClick={() => setShowModal(true)}>Login/Sign Up</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Modal
        size='lg'
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby='signup-modal'
      >
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              <Nav variant='pills'>
                <Nav.Item>
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey='login'>
                <LoginForm handleLogin={handleLogin} />
              </Tab.Pane>
              <Tab.Pane eventKey='signup'>
                <SignUpForm handleLogin={handleLogin} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;