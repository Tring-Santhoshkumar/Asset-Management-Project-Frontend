import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

const DashboardLayout = () => {
  return (
    <div className='dashboardLayout'>
      <div className="sideContent">
        <Sidebar />
      </div>
        <div className='mainContent'>
            <Outlet />
        </div>
    </div>
  )
}

export default DashboardLayout
