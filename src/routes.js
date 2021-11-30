import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import User from './pages/User';
import NotFound from './pages/Page404';
import Sectors from './pages/sectors';
import Positions from './pages/positions';
import Categories from './pages/categories';
import EmployeeForm from './pages/employees/employee-form';
import EmployeeList from './pages/employees/employee-list';
import DiscTest from './pages/disc';

// ----------------------------------------------------------------------

export default function Router({ isLoggedIn }) {
  return useRoutes([
    {
      path: '/dashboard',
      element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { path: '/dashboard/', element: <Navigate to="/dashboard/app" /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'employees', element: <EmployeeList /> },
        { path: 'employees/create', element: <EmployeeForm /> },
        { path: 'employees/edit/:id', element: <EmployeeForm /> },
        { path: 'sectors', element: <Sectors /> },
        { path: 'positions', element: <Positions /> },
        { path: 'categories', element: <Categories /> },
        { path: 'disc', element: <DiscTest /> },
        { path: 'user', element: <User /> }
      ]
    },
    {
      path: '/',
      element: !isLoggedIn ? <LogoOnlyLayout /> : <Navigate to="/dashboard/app" />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
