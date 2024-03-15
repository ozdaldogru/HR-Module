import './App.css';
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import DepartmentList from './pages/DepartmentList';
import RoleList from './pages/RoleList';
import EmployeeList from './pages/EmployeeList';
import EmployeeAdd from './pages/EmployeeAdd';
import ManagerList from './pages/ManagerList';
import Login from './components/Login';

function App() {
  return (
    <>
      <Navbar />
      <Login />
      <Outlet />
      <DepartmentList />
      <RoleList />
      <EmployeeList />
      <EmployeeAdd />
      <ManagerList />      
    </>
  );
}

export default App;
