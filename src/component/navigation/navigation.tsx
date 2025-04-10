import Login from '../../pages/LoginPage/Login'
import DashboardAdmin from '../../pages/AdminPage/DashboardAdmin';
import Users from '../../pages/UserPage/Users';
import Assets from '../../pages/AdminPage/Assets';
import AdminUsers from '../../pages/AdminPage/AdminUsers';
import ChangePassword from '../../pages/ChangePasswordPage/ChangePassword';
import LandingPage from '../../pages/LandingPage/LandingPage';
import Notifications from '../../pages/AdminPage/Notifications';

export const publicRoutes = [
    {
        path : "/",
        element : <LandingPage />
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
    {
        path: "admin/notifications",
        element: <Notifications />
    }
]
