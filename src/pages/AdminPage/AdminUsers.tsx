import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ADDUSER, PAGINATEDUSERS } from "./AdminUsersApi";
import { useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { MenuItem, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Dialog, 
Button, DialogActions, DialogContent, DialogTitle, TextField, TablePagination } from "@mui/material";
import { toastAlert } from "../../component/customComponents/toastify";
import AppLoaderComponent from "../../component/customComponents/Loader/AppLoaderComponent";

interface UserType {
  name: string,
  email: string,
  role: string
}

interface Asset {
  id: string;
  serial_no: string;
  type: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  designation?: string;
  department?: string;
  status?: string;
  assets?: Asset[] | null;
}

const UsersPage = () => {

  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [filter, setFilter] = useState<string>("");
  const { data, refetch } = useQuery(PAGINATEDUSERS, { variables: { page, limit: rowsPerPage, role: filter || null, }, fetchPolicy: "no-cache" });
  const [addUser] = useMutation(ADDUSER, {
    onCompleted() {
      refetch();
    },
    onError(error) {
      console.log('ERROR:', error.message)
    },
  });
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserType>({ name: "", email: "", role: "user" });
  const [errors, setErrors] = useState<Partial<UserType>>({ name: "", email: "", role: "user" });

  const handleChangeAdding = (e:  React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilter(e.target.value);
    setPage(1);
    refetch({ page: 1, limit: rowsPerPage, role: e.target.value || null});
  }

  const filtering = data?.paginatedUsers?.users || [];

  const [open, setOpen] = useState(false);

  const handleOpenAdd = () => {
    setOpen(true);
  }

  const handleCloseAdd = () => {
    setOpen(false);
  }
  const [loader, setLoader] = useState(false);
  const validateForm = () => {
    const newErrors: Partial<UserType> = {};

    if (!userData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    else if (userData.name.length < 3){
      newErrors.name = "Name must be at least 3 characters";
    }
    else if (!/^[A-Za-z\s]+$/.test(userData.name)) {
      newErrors.name = 'Name must only contains alphabets';
    }

    if (!userData.email.trim()){
      newErrors.email = "Email is required";
    } 
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!userData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubmit = async () => {
    if (validateForm()) {
      const requiredFields = ["name", "email", "role"];

      const isValid = requiredFields.every(field => userData[field as keyof UserType]?.toString().trim());
      setLoader(true);

      if (isValid === false) {
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
  const handlePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
    refetch({ page: newPage + 1, limit: rowsPerPage, role: filter || null });
  };
  const handleRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(1);
    refetch({ page: 1, limit: parseInt(event.target.value), role: filter || null });
  };

  return (
    <div className="usersContainer">
      <div className="headerSection">
        <h2 className="adminUsersHeading">List of All Users</h2>
        <div className="actions">
          <div className="filterSelectContainer">
            <select className="filterSelect" name="role" onChange={handleChange} value={filter}>
              <option value="">All Roles</option>
              <option value="ADMIN">Admins</option>
              <option value="USER">Users</option>
            </select>
          </div>
          <button className="addButton" onClick={handleOpenAdd}><AddCircleOutline /> Add User</button>
        </div>
      </div>
      <TableContainer component={Paper} className="tableContainer" style={{ maxHeight: "510px", overflowY: "auto", position: "relative" }}>
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
            {filtering?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">No users found.</TableCell>
              </TableRow>
            )}
            {filtering?.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.designation ?? " - "}</TableCell>
                <TableCell>{user.department ?? " - "}</TableCell>
                <TableCell>{user.status ?? " - "}</TableCell>
                <TableCell>{(user?.assets?? []).length > 0 ? (
                  <ul>
                    {user.assets?.map((asset: Asset) => (
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
        <div className="pagination">
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data?.paginatedUsers?.totalCount || 0}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            onPageChange={handlePage}
            onRowsPerPageChange={handleRowsPerPage}
          />
        </div>
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
