import { Link, useNavigate } from 'react-router-dom';
import { toastAlert } from '../customComponents/toastify';

const Sidebar = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  return (
    <div className='sideBar'>
      <ul className='sideBarMenu'>
        {userRole == 'admin' ? (
          <>
            <li><Link to='/admin/dashboard'>Dashboard</Link></li>
            <li><Link to='/admin/users'>Users</Link></li>
            <li><Link to='/admin/assets'>Assets</Link></li>
            <li onClick={() => { navigate('/login'); localStorage.clear(); toastAlert('info','Logout Success!')}}>Logout</li>
          </>
        ) : (
          <>
            <li><Link to='/users/dashboard'>Dashboard</Link></li>
            <li onClick={() => { navigate('/login'); localStorage.clear(); toastAlert('info','Logout Success!')}}>Logout</li>
          </>
        )}
      </ul>
    </div>
  )
}

export default Sidebar