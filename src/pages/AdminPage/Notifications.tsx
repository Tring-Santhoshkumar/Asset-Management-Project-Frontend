import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GETNOTIFICATIONS, READNOTIFICATIONS } from './NotificationsApi';
import { toastAlert } from '../../component/customComponents/toastify';
import AppLoaderComponent from '../../component/customComponents/Loader/AppLoaderComponent';
 
interface StatusType{
    [key: string]: "pending" | "approved" | "rejected";
}
const Notifications = () => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { data, refetch } = useQuery(GETNOTIFICATIONS, { variables: { page, limit: rowsPerPage }, fetchPolicy: "no-cache" });
    const [readNotifications] = useMutation(READNOTIFICATIONS);
    const [loader, setLoader] = useState(false);
    const [status,setStatus] = useState<StatusType>({});
    const [filter, setFilter] = useState("all");
    useEffect(() => {
        if (data?.getNotifications?.notifications) {
          const newStatus: StatusType = {};
          data.getNotifications.notifications.forEach((notified: any) => {
            if (notified.approved) newStatus[notified.id] = "approved";
            else if (notified.rejected) newStatus[notified.id] = "rejected";
          });
          setStatus(newStatus);
        }
      }, [data]);
    const filteringNotifications = data?.getNotifications?.notifications?.filter((notified: any) => {
        if(filter === "approved") return status[notified.id] === "approved";
        if(filter === "rejected") return status[notified.id] === "rejected";
        return true;
    });
    const handleNotificationClick = async (id: string, choice: boolean) => {
        setLoader(true);
        setStatus((prev) => ({ ...prev, [id]: "pending" }));
        try {
          await readNotifications({ variables: { id, choice } });
          refetch();
          toastAlert('success','Notification Cleared as per Request');
          setStatus((prev) => ({ ...prev, [id]: choice ? "approved" : "rejected" }));
        } catch (error: any) {
          toastAlert('error',error);
          setStatus((prev) => ({ ...prev, [id]: "pending" }));
        }
        finally{
          setLoader(false);
        }
      }
    const handlePage = (event: any, newPage: number) => {
        setPage(newPage + 1);
        refetch({ page: newPage + 1, limit: rowsPerPage });
    };
    const handleRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(1);
        refetch({ page: 1, limit: parseInt(event.target.value) });
    };
  return (
    <div className="usersContainer">
          <div className="headerSection">
            <h2 className="adminUsersHeading">List of All Notifications</h2>
            <div className="actions">
              <div className="filterSelectContainer">
                <select className="filterSelect" name="assigned_status" value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="all">All Notifications</option>
                  <option value="approved">Approved Assets</option>
                  <option value="rejected">Rejected Assets</option>
                </select>
              </div>
            </div>
          </div>
          <TableContainer component={Paper} style={{ maxHeight: 540, overflowY: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {["User Name", "Email", "Asset Serial No", "Asset Type", "Asset Name", "Details"].map((header) => (
                <TableCell key={header} sx={{ backgroundColor: "#1976d2", color: "white", fontWeight: "bold" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
          {loader && <AppLoaderComponent />}
            {filteringNotifications?.map((notified: any) => (
              <TableRow key={notified.id} hover>
                <TableCell>{notified.userId.name}</TableCell>
                <TableCell>{notified.userId.email}</TableCell>
                <TableCell>{notified.assetId.serial_no}</TableCell>
                <TableCell>{notified.assetId.type}</TableCell>
                <TableCell>{notified.assetId.name}</TableCell>
                <TableCell>{status[notified.id] === "approved" ?
                ( 
                <Typography color='primary' variant='h6' sx={{ marginLeft:'40px'}}>Approved</Typography>
                ) : 
                status[notified.id] === "rejected" ?
                (
                <Typography color='error' variant='h6' sx={{ marginLeft:'40px'}}>Rejected</Typography>
                ) : (
                  <>
                    <Button variant="contained" color="primary" onClick={() => handleNotificationClick(notified.id, true)} style={{ marginRight: "8px", width:'90px' }} disabled={status[notified.id] === "pending"}>
                    Approve
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleNotificationClick(notified.id, false)} style={{ width:'80px' }} disabled={status[notified.id] === "pending"}>
                    Reject
                    </Button>
                  </>
                )}
                </TableCell>
              </TableRow>
           ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data?.getNotifications?.totalCount || 0}
          rowsPerPage={rowsPerPage}
          page={page - 1}
          onPageChange={handlePage}
          onRowsPerPageChange={handleRowsPerPage}
        />
      </TableContainer>
    </div>
  )
}

export default Notifications