import Register from '../../pages/RegisterPage/Register'
import Login from '../../pages/LoginPage/Login'
import DashboardAdmin from '../../pages/AdminPage/DashboardAdmin';
import Users from '../../pages/UserPage/Users';
import Assets from '../../pages/AdminPage/Assets';
import AdminUsers from '../../pages/AdminPage/AdminUsers';
import ChangePassword from '../../pages/AdminPage/ChangePassword';

export const publicRoutes = [
    {
        path : "/",
        element : <Register />
    },
    {
        path : "/login",
        element : <Login />
    },
    {
        path : "/ChangePassword",
        element : <ChangePassword />
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
        element: <Users userId = { localStorage.getItem("userId") || "" } />
    },
    {
        path: "/admin/users/:userId",
        element: <Users userId={localStorage.getItem("selectedUserId") || ""} />
    },
]