import { Outlet ,Navigate } from 'react-router-dom';

const PublicRoutes = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if(token){
        return role == "admin" ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/users/dashboard" replace />;
    }
    return <Outlet />;
}

export default PublicRoutes