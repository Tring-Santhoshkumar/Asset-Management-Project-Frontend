import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ADDUSER, GET_USERS } from "./AdminUsersApi";
import { useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import FilterListIcon from "@mui/icons-material/FilterList";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Select, MenuItem, IconButton, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Dialog, Button, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress } from "@mui/material";
import { toastAlert } from "../../component/customComponents/toastify";
import AppLoaderComponent from "../../component/customComponents/Loader/AppLoaderComponent";

interface UserType {
  name: string,
  email: string,
  role: string
}

const UsersPage = () => {

  const { data, refetch } = useQuery(GET_USERS, {
    fetchPolicy: "no-cache",
  });
  const [addUser] = useMutation(ADDUSER, {
    onCompleted() {
      refetch();
    },
    onError(error) {
      console.log('ERROR:', error.message)
    },
  });
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [userData, setUserData] = useState<UserType>({ name: "", email: "", role: "user" });
  const [errors, setErrors] = useState<Partial<UserType>>({ name: "", email: "", role: "user" });

  const handleChangeAdding = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleChange = (e: any) => {
    setFilter(e.target.value);
  }

  const filtering = data?.users?.filter((user: any) => {
    if (!filter) return true;
    return user?.role == filter;
  })

  const [open, setOpen] = useState(false);

  const handleOpenAdd = () => {
    setOpen(true);
  }

  const handleCloseAdd = () => {
    setOpen(false);
  }
  const [loader, setLoader] = useState(false);
  const validateForm = () => {
    let newErrors: Partial<UserType> = {};

    if (!userData.name.trim()) newErrors.name = 'Name is required';
    else if (userData.name.length < 3) newErrors.name = "Name must be at least 3 characters";
    else if (!/^[A-Za-z\s]+$/.test(userData.name)) newErrors.name = 'Name must only contains alphabets';

    if (!userData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) newErrors.email = "Invalid email format";

    if (!userData.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length == 0;
  };

  const handleAddSubmit = async () => {
    if (validateForm()) {
      const requiredFields = ["name", "email", "role"];

      const isValid = requiredFields.every(field => userData[field as keyof UserType]?.toString().trim());
      setLoader(true);

      if (isValid == false) {
        toastAlert("error", 'Fill all the required fields');
        return;
      }
      try {
        const res = await addUser({ variables: { name: userData.name, email: userData.email, role: userData.role } });
        if (res?.data?.addUser) {
          toastAlert("success", 'User Added Successfully!');
          handleCloseAdd();
        }
        else {
          toastAlert("error", 'Email Already exists');
        }
      }
      catch (error: any) {
        toastAlert("error", error);
      }
      finally {
        setLoader(false);
      }
    }
  }

  return (
    <div className="usersContainer">
      <div className="headerSection">
        <h2 className="adminUsersHeading">List of All Users</h2>
        <div className="actions">
          <div className="filterSelectContainer">
            <select className="filterSelect" name="role" onChange={handleChange} value={filter}>
              <option value="">All Roles</option>
              <option value="admin">Admins</option>
              <option value="user">Users</option>
            </select>
          </div>
          <button className="addButton" onClick={handleOpenAdd}><AddCircleOutline/> Add User</button>
        </div>
      </div>
      <TableContainer component={Paper} className="tableContainer" style={{ maxHeight: "540px", overflowY: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {["Name", "Email", "Designation", "Department", "Status", "Asset Status", "Actions"].map((header) => (
                <TableCell key={header} sx={{ backgroundColor: "#1976d2", color: "white", fontWeight: "bold" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtering?.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.designation ?? " - "}</TableCell>
                <TableCell>{user.department ?? " - "}</TableCell>
                <TableCell>{user.status ?? " - "}</TableCell>
                <TableCell>{user.assigned_assets?.length > 0 ? (
                  <ul>
                    {user.assigned_assets?.map((asset: any) => (
                      <li key={asset.id}>{asset.serial_no} ({asset.type} - {asset.name})</li>
                    ))}
                  </ul>
                ) : (" - ")}
                </TableCell>
                <TableCell>
                  <button className="viewButton" onClick={() => { localStorage.setItem("selectedUserId", user.id); navigate(`/admin/users/${user.id}`) }}><RemoveRedEyeIcon /></button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleCloseAdd}>
        {loader && <AppLoaderComponent />}
        <DialogTitle color='primary'>Add User/Admin</DialogTitle>
        <DialogContent style={{ width: "500px" }}>
          <TextField fullWidth label="Name" name="name" value={userData.name} onChange={handleChangeAdding} margin="dense" required />
          {errors.name && <p className="formError">{errors.name}</p>}
          <TextField fullWidth label="Email" name="email" value={userData.email} onChange={handleChangeAdding} margin="dense" required />
          {errors.email && <p className="formError">{errors.email}</p>}
          <TextField select fullWidth label="Role" name="role" value={userData.role} onChange={handleChangeAdding} margin="dense" required>
            {errors.role && <p className="formError">{errors.role}</p>}
            {["admin", "user"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} color="primary">Cancel</Button>
          <Button onClick={() => { handleAddSubmit(); }} color="primary" variant="contained" disabled={loader}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersPage;
