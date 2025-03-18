import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ADDUSER, GET_USERS } from "./AdminUsersApi";
import { useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import FilterListIcon from "@mui/icons-material/FilterList";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Select, MenuItem, IconButton, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Dialog, Button, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress } from "@mui/material";
import { toastAlert } from "../../component/customComponents/toastify";

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
  const [errors,setErrors] = useState<Partial<UserType>>({name: "", email: "", role: "user"});

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
  const [loader,setLoader] = useState(false);
  const validateForm = () => {
    let newErrors: Partial<UserType> = {};

    if (!userData.name.trim()) newErrors.name = 'Name is required';
    else if (userData.name.length < 3) newErrors.name = "Name must be at least 3 characters";
    else if(!/^[A-Za-z\s]+$/.test(userData.name)) newErrors.name = 'Name must only contains alphabets';

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

    // console.log(userData);
    setLoader(true);

    if (isValid == false) {
      toastAlert('error', 'Fill all the required fields');
      return;
    }
    try {
      const res = await addUser({ variables: { name: userData.name, email: userData.email, role: userData.role } });
      toastAlert('success', 'User Added Successfully!');
    }
    catch (error: any) {
      console.error("GraphQL Errors:", error.graphQLErrors);
      console.error("Network Errors:", error.networkError);
      toastAlert('error', 'User Adding Failed!!!');
    }
    finally{
      setLoader(false);
    }
    handleCloseAdd();
  }
  }

  return (
    <div className="usersContainer">
      <h2 className="adminUsersHeading">List of All Users</h2>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <div className="formContent">
          <FilterListIcon style={{ color: "gray", marginRight: 10 }} />
          <Select name="role" className="userInput" onChange={handleChange} value={filter} displayEmpty>
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="admin">Admins</MenuItem>
            <MenuItem value="user">Users</MenuItem>
          </Select>
        </div>
        <IconButton onClick={handleOpenAdd} sx={{ color: 'gray', fontSize: 40, marginLeft: 2 }}>
          <AddCircleOutline sx={{ fontSize: 40 }} />
        </IconButton>
      </div>
      <TableContainer component={Paper} className="tableContainer" style={{ maxHeight: 500, overflowY: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {["Name", "Email", "Gender", "Designation", "Department", "Status", "Actions"].map((header) => (
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
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.designation}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <button className="viewButton" onClick={() => { localStorage.setItem("selectedUserId", user.id); navigate(`/admin/users/${user.id}`) }}><RemoveRedEyeIcon/></button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleCloseAdd}>
        <DialogTitle color='primary'>Add User/Admin</DialogTitle>
        <DialogContent style={{ width: "500px" }}>
          <TextField fullWidth label="Name" name="name" value={userData.name} onChange={handleChangeAdding} margin="dense" required error={!!errors.name} />
          <TextField fullWidth label="Email" name="email" value={userData.email} onChange={handleChangeAdding} margin="dense" required error={!!errors.email}/>
          <TextField select fullWidth label="Role" name="role" value={userData.role} onChange={handleChangeAdding} margin="dense" required error={!!errors.role}>
            {["admin", "user"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} color="primary">Cancel</Button>
          <Button onClick={() => { handleAddSubmit(); }} color="primary" variant="contained" disabled={loader}> {loader ? <CircularProgress size={24} color="inherit" /> : "Submit"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersPage;
