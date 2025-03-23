import { Link, useNavigate } from 'react-router-dom';
import { toastAlert } from '../customComponents/toastify';
import logo from "../../assets/logo.png"
import { jwtDecode } from 'jwt-decode';

const Sidebar = () => {
  const navigate = useNavigate();
  // const userRole = localStorage.getItem("role");
  const currentMenu = window.location.pathname;
  const token = localStorage.getItem("token") || '';
  const decodedData: any = jwtDecode(token);
  const userRole = decodedData.role;
  return (
    <div className='sideBar'>
      <img src={logo} alt="Company Logo" className='logo'/>
      <ul className='sideBarMenu'>
        {userRole == 'admin' ? (
          <>
            <li className={currentMenu === '/admin/dashboard' ? 'active' : ''}><Link to='/admin/dashboard'>Dashboard</Link></li>
            <li className={currentMenu === '/admin/users' ? 'active' : ''}><Link to='/admin/users'>Users</Link></li>
            <li className={currentMenu === '/admin/assets' ? 'active' : ''}><Link to='/admin/assets'>Assets</Link></li>
          </>
        ) : (
          <>
            <li className={currentMenu === '/users/dashboard' ? 'active' : ''}><Link to='/users/dashboard'>Dashboard</Link></li>
          </>
        )}
      </ul>
      <button className='logoutButton' onClick={() => { navigate('/'); localStorage.clear(); toastAlert('info','Logout Success!')}}>Logout</button>
    </div>
  )
}

export default Sidebar