import Register from '../../pages/RegisterPage/Register'
import Login from '../../pages/LoginPage/Login'
import DashboardAdmin from '../../pages/AdminPage/DashboardAdmin';
import Users from '../../pages/UserPage/Users';
import Assets from '../../pages/AdminPage/Assets';
import AdminUsers from '../../pages/AdminPage/AdminUsers';

export const publicRoutes = [
    {
        path : "/",
        element : <Register />
    },
    {
        path : "/login",
        element : <Login />
    }
];

export const privateRoutes = [
    {
        path : "/admin/dashboard",
        element : <DashboardAdmin />
    },
    {
        path : "/admin/users",
        element : <AdminUsers />
    },
    {
        path : "/admin/assets",
        element : <Assets />
    },
    {
        path : "/users/dashboard",
        element : <Users />
    },
]