import { useState } from 'react'; // Importing the useState hook from React
import { Link } from 'react-router-dom'; // Importing the Link component from react-router-dom
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap'; // Importing various components from react-bootstrap
import SignUpForm from './SignupForm'; // Importing the SignUpForm component from './SignupForm'
import LoginForm from './LoginForm'; // Importing the LoginForm component from './LoginForm'

import Auth from '../utils/auth'; // Importing the Auth module from '../utils/auth'

const AppNavbar = () => { // Defining a functional component called AppNavbar
  // set modal display state
  const [showModal, setShowModal] = useState(false); // Declaring a state variable 'showModal' and a function 'setShowModal' to control the visibility of the modal

  return (
    <>
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Container fluid>
          <Navbar.Brand as={Link} to='/'>
          💻 Employee Management System: HRRIS 💼
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar' />
          <Navbar.Collapse id='navbar' className='d-flex flex-row-reverse'>
            <Nav className='ml-auto d-flex'>
              <Nav.Link as={Link} to='/departments'>
                Departments
              </Nav.Link>
              <Nav.Link as={Link} to='/managers'>
                Managers
              </Nav.Link>                
              <Nav.Link as={Link} to='/employees'>
                Employees
              </Nav.Link>
              <Nav.Link as={Link} to='/roles'>
                Roles
              </Nav.Link>
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={() => setShowModal(true)}>Login/Sign Up</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* set modal data up */}
      <Modal
        size='lg'
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby='signup-modal'>
        {/* tab container to do either signup or login component */}
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
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey='signup'>
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar; // Exporting the AppNavbar component

// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
// import SignUpForm from './SignupForm';
// import LoginForm from './LoginForm';

// import Auth from '../utils/auth';

// const AppNavbar = () => {
//   // set modal display state
//   const [showModal, setShowModal] = useState(false);

//   return (
//     <>
//       <Navbar bg='dark' variant='dark' expand='lg'>
//         <Container fluid>
//           <Navbar.Brand as={Link} to='/'>
//             Google Books Search
//           </Navbar.Brand>
//           <Navbar.Toggle aria-controls='navbar' />
//           <Navbar.Collapse id='navbar' className='d-flex flex-row-reverse'>
//             <Nav className='ml-auto d-flex'>
//               <Nav.Link as={Link} to='/'>
//                 Search For Books
//               </Nav.Link>
//               {/* if user is logged in show saved books and logout */}
//               {Auth.loggedIn() ? (
//                 <>
//                   <Nav.Link as={Link} to='/saved'>
//                     See Your Books
//                   </Nav.Link>
//                   <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
//                 </>
//               ) : (
//                 <Nav.Link onClick={() => setShowModal(true)}>Login/Sign Up</Nav.Link>
//               )}
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>
//       {/* set modal data up */}
//       <Modal
//         size='lg'
//         show={showModal}
//         onHide={() => setShowModal(false)}
//         aria-labelledby='signup-modal'>
//         {/* tab container to do either signup or login component */}
//         <Tab.Container defaultActiveKey='login'>
//           <Modal.Header closeButton>
//             <Modal.Title id='signup-modal'>
//               <Nav variant='pills'>
//                 <Nav.Item>
//                   <Nav.Link eventKey='login'>Login</Nav.Link>
//                 </Nav.Item>
//                 <Nav.Item>
//                   <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
//                 </Nav.Item>
//               </Nav>
//             </Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Tab.Content>
//               <Tab.Pane eventKey='login'>
//                 <LoginForm handleModalClose={() => setShowModal(false)} />
//               </Tab.Pane>
//               <Tab.Pane eventKey='signup'>
//                 <SignUpForm handleModalClose={() => setShowModal(false)} />
//               </Tab.Pane>
//             </Tab.Content>
//           </Modal.Body>
//         </Tab.Container>
//       </Modal>
//     </>
//   );
// };

// export default AppNavbar;