import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Badge, Button, Card, CardContent, CircularProgress, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useMutation, useQuery } from "@apollo/client";
import { USERCHART } from "./DashboardAdminApi";
import './DashboardAdminStyle.scss'
import { GETALLASSETS } from "./AssetsApi";
import { GETNOTIFICATIONS, READNOTIFICATIONS } from "./NotificationsApi";
import { useState } from "react";
import { toastAlert } from "../../component/customComponents/toastify";
import AppLoaderComponent from "../../component/customComponents/Loader/AppLoaderComponent";

const COLORS = ["#1976d2", "#64B5F6","#FFBB28", "#FF8042"];
const COLORS2 = ["#FFBB28", "#FF8042","#EE2054"];

const DashboardAdmin = () => {

  const { data: userChart } = useQuery(USERCHART);
  const { data: assetChart } = useQuery(GETALLASSETS);
  const roleChart = new Map();
  const statusChart = new Map();
  const genderChart = new Map();
  const assetsChart = new Map();
  const totalAssetsChart = new Map();
  const typeAssetsChart = new Map();
  userChart?.users.forEach((user: { role: any; status: any, gender: any }) => {
    roleChart.set(user.role, (roleChart.get(user.role) || 0) + 1);
    statusChart.set(user.status, (statusChart.get(user.status) || 0) + 1);
    genderChart.set(user.gender, (genderChart.get(user.gender) || 0) + 1);
  });
  assetChart?.allAssets.forEach((asset: {assigned_status: any, condition: any, type: any}) => {
    assetsChart.set(asset.assigned_status, (assetsChart.get(asset.assigned_status) || 0) + 1);
    totalAssetsChart.set(asset.condition, (totalAssetsChart.get(asset.condition) || 0) + 1);
    typeAssetsChart.set(asset.type,(typeAssetsChart.get(asset.type) || 0) + 1);
  })
  const roleDataChart = Array.from(roleChart, ([name, value]) => ({ name, value }));
  const statusDataChart = Array.from(statusChart, ([name, value]) => ({ name, value }));
  const genderDataChart = Array.from(genderChart, ([name, value]) => ({ name, value }));
  const assetDataChart = Array.from(assetsChart, ([name, value]) => ({ name, value }));
  const assetTotalChart = Array.from(totalAssetsChart, ([name ,value]) => ({ name, value }));
  const assetTypeChart = Array.from(typeAssetsChart, ([name, value]) => ({ name, value }));

  const { data: allNotifications, refetch } = useQuery(GETNOTIFICATIONS);
  const [readNotifications] = useMutation(READNOTIFICATIONS);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: any) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const filterNotifications = allNotifications?.getNotifications?.filter((notification:any) => notification.is_read == false);

  const [loader, setLoader] = useState(false);
  const handleNotificationClick = async (id: Number, choice: boolean) => {
    setLoader(true);
    try {
      await readNotifications({ variables: { id, choice } });
      refetch();
      toastAlert('success','Notification Cleared as per Request');
    } catch (error: any) {
      toastAlert('error',error);
    }
    finally{
      setLoader(false);
    }
    handleClose();
  }
  return (
    <Card sx={{ maxWidth: "100%", padding: "20px", backgroundColor: "#f8f9fa" }}>
      <IconButton color="inherit" onClick={handleClick} style={{marginLeft:'95%'}}>
        <Badge badgeContent={filterNotifications?.length || 0} color="error"><NotificationsIcon /></Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {filterNotifications?.length === 0 ? (
          <MenuItem>No notifications</MenuItem>
        ) : (
          filterNotifications?.map((notification : any) => (
            <MenuItem key={notification.id}>
              {loader && <AppLoaderComponent />}
              <div style={{ display: "flex", flexDirection: "column", gap: '5px' }}>
                <span>{notification.message}</span>
                <div style={{display:'flex', gap:'10px'}}>
                  <Button size="small" color="success" variant="contained" onClick={() => handleNotificationClick(notification.id, true)}>Approve</Button>
                  <Button size="small" color="error" variant="contained" onClick={() => handleNotificationClick(notification.id, false)}>Reject</Button>
                </div>
              </div>
            </MenuItem>
          ))
        )}
      </Menu>

      <Typography variant="h5" align="center" gutterBottom>
        📊 Admin Dashboard
      </Typography>

      <Typography variant="h6" align="center" sx={{ marginBottom: "20px", color: "#1976d2" }}>
        Total Users: {userChart?.users?.length || 0}
      </Typography>

      <CardContent className="dashboardGrid">
        <div className="chartContainer">
          <Typography variant="h6" align="center">User Roles</Typography>
          <PieChart width={320} height={340}>
            <Pie data={roleDataChart} cx={150} cy={170} innerRadius={55} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
              {roleDataChart.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend formatter={(value) => {
              const role: any = roleDataChart.find((item) => item.name === value);
              return `${value.charAt(0).toUpperCase()}${value.slice(1)} - (${role?.value || 0})`;
            }} />
          </PieChart>
        </div>
        <div className="chartContainer">
          <Typography variant="h6" align="center">User Status</Typography>
          <PieChart width={320} height={340}>
            <Pie data={statusDataChart} cx={150} cy={170} innerRadius={55} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
              {statusDataChart.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend formatter={(value) => {
              const status: any = statusDataChart.find((item) => item.name === value);
              return `${value.charAt(0).toUpperCase()}${value.slice(1)} users - (${status?.value || 0})`;
            }} />
          </PieChart>
        </div>
        <div className="chartContainer">
          <Typography variant="h6" align="center">User Gender</Typography>
          <PieChart width={320} height={340}>
            <Pie data={genderDataChart} cx={150} cy={170} innerRadius={55} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
              {genderDataChart?.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend formatter={(value) => {
              const gender = genderDataChart.find((item) => item.name === value);
              return `${value?.charAt(0).toUpperCase() || "Unspecified"}${value?.slice(1) || ""} - (${gender?.value || 0})`;
            }} />

          </PieChart>
        </div>
        <div className="chartContainer">
          <Typography variant="h6" align="center">Asset Assigned Status</Typography>
          <PieChart width={320} height={340}>
            <Pie data={assetDataChart} cx={150} cy={170} innerRadius={55} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
              {assetDataChart.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend formatter={(value) => {
              const total: any = assetDataChart.find((item) => item.name === value);
              return `${value.charAt(0).toUpperCase()}${value.slice(1)} assets - (${total?.value || 0})`;
            }} />
          </PieChart>
        </div>
        <div className="chartContainer">
          <Typography variant="h6" align="center">Asset Condition Status</Typography>
          <PieChart width={320} height={340}>
            <Pie data={assetTotalChart} cx={150} cy={170} innerRadius={55} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
              {assetTotalChart.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend formatter={(value) => {
              const total: any = assetTotalChart.find((item) => item.name === value);
              return `${value.charAt(0).toUpperCase()}${value.slice(1)} condition assets - (${total?.value || 0})`;
            }} />
          </PieChart>
        </div>
        <div className="chartContainer">
          <Typography variant="h6" align="center">Asset Type Status</Typography>
          <PieChart width={320} height={340}>
            <Pie data={assetTypeChart} cx={150} cy={170} innerRadius={55} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
              {assetTypeChart.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend formatter={(value) => {
              const type: any = assetTypeChart.find((item) => item.name === value);
              return `${value.charAt(0).toUpperCase()}${value.slice(1)} - (${type?.value || 0})`;
            }} />
          </PieChart>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardAdmin;
