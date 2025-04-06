import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Avatar, Badge, Box, Button, Card, CardContent, CircularProgress, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useMutation, useQuery } from "@apollo/client";
import { LATESTUPDATEDUSER, USERCHART } from "./DashboardAdminApi";
import './DashboardAdminStyle.scss'
import { GETALLASSETS } from "./AssetsApi";
import { motion } from "framer-motion";
import { GETNOTIFICATIONS, GETNOTIFICATIONSICON, READNOTIFICATIONS } from "./NotificationsApi";
import { useState } from "react";
import { toastAlert } from "../../component/customComponents/toastify";
import AppLoaderComponent from "../../component/customComponents/Loader/AppLoaderComponent";

const COLORS = ["#1976d2", "#64B5F6", "#FFBB28", "#FF8042"];
const COLORS2 = ["#FFBB28", "#FF8042", "#EE2054"];

const DashboardAdmin = () => {

  const { data: userChart } = useQuery(USERCHART);
  const { data: assetChart } = useQuery(GETALLASSETS);
  const roleChart = new Map();
  const statusChart = new Map();
  const assetsChart = new Map();
  const totalAssetsChart = new Map();
  const typeAssetsChart = new Map();
  userChart?.users.forEach((user: { role: string; status: string }) => {
    roleChart.set(user.role, (roleChart.get(user.role) || 0) + 1);
    statusChart.set(user.status, (statusChart.get(user.status) || 0) + 1);
  });
  assetChart?.allAssets.forEach((asset: { assigned_status: string, condition: string, type: string }) => {
    assetsChart.set(asset.assigned_status, (assetsChart.get(asset.assigned_status) || 0) + 1);
    totalAssetsChart.set(asset.condition, (totalAssetsChart.get(asset.condition) || 0) + 1);
    typeAssetsChart.set(asset.type, (typeAssetsChart.get(asset.type) || 0) + 1);
  })
  const roleDataChart = Array.from(roleChart, ([name, value]) => ({ name, value }));
  const statusDataChart = Array.from(statusChart, ([name, value]) => ({ name, value }));
  const assetDataChart = Array.from(assetsChart, ([name, value]) => ({ name, value }));
  const assetTotalChart = Array.from(totalAssetsChart, ([name, value]) => ({ name, value }));
  const assetTypeChart = Array.from(typeAssetsChart, ([name, value]) => ({ name, value }));

  // const { data: allNotifications, refetch } = useQuery(GETNOTIFICATIONS);
  const { data: allNotifications, refetch } = useQuery(GETNOTIFICATIONSICON);
  const { data: latestUpdatedUser} = useQuery(LATESTUPDATEDUSER);
  const [readNotifications] = useMutation(READNOTIFICATIONS);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: any) => {
    setAnchorEl(e.currentTarget);
  }; 
  const handleClose = () => {
    setAnchorEl(null);
  };
  const filterNotifications = allNotifications?.getAllNotificationsIcon?.filter((notification: any) => notification.is_read == false);

  const [loader, setLoader] = useState(false);
  const handleNotificationClick = async (id: Number, choice: boolean) => {
    setLoader(true);
    try {
      await readNotifications({ variables: { id, choice } });
      refetch();
      toastAlert('success', 'Notification Cleared as per Request');
    } catch (error: any) {
      toastAlert('error', error);
    }
    finally {
      setLoader(false);
    }
    handleClose();
  }
  return (
    <Card sx={{ maxWidth: "100%", padding: "20px", backgroundColor: "#f8f9fa" }}>
      <IconButton color="inherit" onClick={handleClick} style={{ marginLeft: '95%' }}>
        <Badge badgeContent={filterNotifications?.length || 0} color="error"><NotificationsIcon /></Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {filterNotifications?.length === 0 ? (
          <MenuItem>No notifications</MenuItem>
        ) : (
          filterNotifications?.map((notification: any) => (
            <MenuItem key={notification.id}>
              {loader && <AppLoaderComponent />}
              <div style={{ display: "flex", flexDirection: "column", gap: '10px' }}>
                <span style={{ maxWidth: '200px', wordWrap: 'break-word', whiteSpace: 'normal' }}>{notification.message}</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button size="small" color="success" variant="contained" onClick={() => handleNotificationClick(notification.id, true)}>Approve</Button>
                  <Button size="small" color="error" variant="contained" onClick={() => handleNotificationClick(notification.id, false)}>Reject</Button>
                </div>
                <hr></hr>
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
          <Typography variant="h6" align="center">Latest Updated User</Typography>
          {latestUpdatedUser?.latestUpdatedUser?.latest ? (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Card sx={{ maxWidth: 360, mx: "auto", mt: 3, p: 2, borderRadius: 3 }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: COLORS[3] }}>
                    {latestUpdatedUser.latestUpdatedUser.latest.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {latestUpdatedUser.latestUpdatedUser.latest.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {latestUpdatedUser.latestUpdatedUser.latest.email}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Typography align="center" sx={{ mt: 2 }}>
              No user data found.
            </Typography>
          )}
          <Typography variant="h6" align="center" marginTop='30px'>Oldest Updated User</Typography>
          {latestUpdatedUser?.latestUpdatedUser?.oldest ? (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Card sx={{ maxWidth: 360, mx: "auto", mt: 3, p: 2, borderRadius: 3 }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: COLORS[1] }}>
                    {latestUpdatedUser.latestUpdatedUser.oldest.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {latestUpdatedUser.latestUpdatedUser.oldest.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {latestUpdatedUser.latestUpdatedUser.oldest.email}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Typography align="center" sx={{ mt: 2 }}>
              No user data found.
            </Typography>
          )}
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
