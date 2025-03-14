import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Card, CardContent, Typography } from "@mui/material";
import { useQuery } from "@apollo/client";
import { USERCHART } from "./DashboardAdminApi";


const COLORS = ["#1976d2", "#64B5F6", "#FFBB28", "#FF8042"];

const DashboardAdmin = () => {

  const { data: userChart } = useQuery(USERCHART);

  const roleChart = new Map();

  const statusChart = new Map();

  userChart?.users.forEach((user: { role: any }) => {
    roleChart.set(user.role, (roleChart.get(user.role) || 0) + 1);
  });

  const roleDataChart = Array.from(roleChart, ([name, value]) => ({ name, value }));

  userChart?.users.forEach((user: { status: any}) => {
    statusChart.set(user.status, (statusChart.get(user.status) || 0) + 1);
  })

  const statusDataChart = Array.from(statusChart, ([name, value]) => ({ name, value}));

  return (
    <Card sx={{ maxWidth: '100%' }}>
      <Typography variant="h6" align="center" gutterBottom>Admin Dashboard</Typography>
      <CardContent style={{display:'flex'}}>
        <PieChart width={320} height={340}>
          <Pie data={roleDataChart} cx={150} cy={200} innerRadius={55} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
            {roleDataChart.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend formatter={(value) => {
            const role : any = roleDataChart.find((item) => item.name === value);
            // console.log(role);
            const roleCount = role?.value || 0;
            return `${value.charAt(0).toUpperCase()}${value.slice(1)} - (${roleCount})` }}
          />
        </PieChart>
        <PieChart width={320} height={340}>
          <Pie data={statusDataChart} cx={150} cy={200} innerRadius={55} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
            {statusDataChart.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend formatter={(value) => {
            const status : any = statusDataChart.find((item) => item.name === value);
            const statusCount = status?.value || 0;
            return `${value.charAt(0).toUpperCase()}${value.slice(1)} users - (${statusCount})` }}
          />
        </PieChart>
      </CardContent>
    </Card>
  );
};

export default DashboardAdmin;
