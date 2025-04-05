import { useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { DEASSIGNASSET, DELETEUSER, GETUSER, UPDATEUSER } from "./UsersApi";
import { toastAlert } from "../../component/customComponents/toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge, Box, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputLabel, Menu, MenuItem, Select, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DevicesIcon from "@mui/icons-material/Devices";
import { ASSIGNASSET, GETALLASSETS, GETASSETBYUSERID, REQUESTASSET } from "../AdminPage/AssetsApi";
import { useForm } from "react-hook-form";
import { CREATE_NOTIFICATION, GETNOTIFICATIONSBYID } from "../AdminPage/NotificationsApi";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AppLoaderComponent from "../../component/customComponents/Loader/AppLoaderComponent";

interface UserIdProp {
  userId: String
}

const Users: React.FC<UserIdProp> = ({ userId }) => {

  // const { data } = useQuery(GETUSER, { variables: { id: userId } });

  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin/users");

  // const selectedUserId = localStorage.getItem('selectedUserId');

  const { data, refetch } = useQuery(GETUSER, { variables: { id: userId }, fetchPolicy: "no-cache" });

  const { data: assetData, refetch: refetchAssetData } = useQuery(GETALLASSETS);

  const { data: assetByUserId, refetch: refetchAssetByUser } = useQuery(GETASSETBYUSERID, { variables: { assigned_to: userId }, fetchPolicy: "no-cache" });

  const [createNotification] = useMutation(CREATE_NOTIFICATION);

  const [assignAsset] = useMutation(ASSIGNASSET);

  // const [requestAsset] = useMutation(REQUESTASSET);

  const [deleteUser] = useMutation(DELETEUSER);

  const [deAssignAsset] = useMutation(DEASSIGNASSET);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: "", email: "", dob: "", gender: "",
      blood_group: "", marital_status: "", phone: "", address: "", designation: "", department: "", city: "", state: "", pin_code: "", country: ""
    },
  });

  const navigate = useNavigate();

  const [updateUser] = useMutation(UPDATEUSER);

  const [editEnable, setEditEnable] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);

  const [openRequest, setOpenRequest] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const [openAssetStatus, setOpenAssetStatus] = useState(false);

  const [selectedType, setSelectedType] = useState<string>("");

  const [selectedAssetId, setSelectedAssetId] = useState<string>("");

  const [selectedView, setSelectedView] = useState("profile");

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleOpenRequest = () => {
    setOpenRequest(true);
  }

  const handleCloseRequest = () => {
    setOpenRequest(false);
  }

  const handleOpenDelete = () => {
    setOpenDelete(true);
  }

  const handleCloseDelete = () => {
    setOpenDelete(false);
  }

  const [assetStatus, setAssetStatus] = useState();

  useEffect(() => {
    if (assetStatus) {
      handleOpenAssetStatus();
    }
  }, [assetStatus]);

  const handleOpenAssetStatus = () => {
    setOpenAssetStatus(true);
    // console.log('Asset-',assetStatus);
  }

  const handleCloseAssetStatus = () => {
    setOpenAssetStatus(false);
  }

  const [assetDataById, setAssetDataById] = useState<any[]>([]);

  useEffect(() => {
    if (assetByUserId && assetByUserId.assetByUserId) {
      const assets = Array.isArray(assetByUserId.assetByUserId) ? assetByUserId.assetByUserId : assetByUserId.assetByUserId ? [assetByUserId.assetByUserId] : [];
      setAssetDataById(assets);
    }
  }, [assetByUserId]);


  const filtering = assetData?.allAssets?.filter((asset: any) => asset.type === selectedType && asset.assigned_status === "Available");

  const [assignLoader, setAssignLoader] = useState(false);

  const [deleteLoader, setDeleteLoader] = useState(false);

  const onAssignAsset = async () => {
    setAssignLoader(true);
    try {
      const updatedUserId = localStorage.getItem("selectedUserId") || userId;
      await assignAsset({ variables: { id: selectedAssetId, assigned_to: updatedUserId } });
      // console.log('RESULT : ',res);
      toastAlert('success', "Asset Assigned Successfully!");
      await refetchAssetByUser();
    }
    catch (error) {
      console.error("Mutation Error:", error);
      toastAlert('error', "Asset Assigned Failed.");
    }
    finally {
      setAssignLoader(false);
    }
    handleClose();
  };

  const onRequestAsset = async () => {
    try {
      // await requestAsset({ variables: { id: selectedAssetId } });
      // console.log("Mutation Response:", res);
      const selectedUser = data?.user?.name;
      const selectedAsset = assetData?.allAssets?.find((asset: any) => asset.id === selectedAssetId);
      const msg = `User ${selectedUser} requested asset ${selectedAsset.name}.`
      // console.log('Filter : ',selectedAssetId,userId,msg);
      await createNotification({
        variables: {
          user_id: userId,
          asset_id: selectedAssetId,
          message: msg,
        }
      });
      toastAlert('success', "Asset Requested Successfully,You'll be notified through mail!");
    }
    catch (error: any) {
      console.error("Mutation Error:", error);
      toastAlert('error', "Asset Assigned Failed.");
    }
  };

  const onDeleteUser = async () => {
    setDeleteLoader(true);
    try {
      await deleteUser({ variables: { id: userId } });
      // console.log("Mutation Response:", res);
      toastAlert('success', "User Deleted Successfull!");
    }
    catch (error) {
      console.error("Mutation Error:", error);
      toastAlert('error', "User deletion Failed.");
    }
    finally {
      setDeleteLoader(false);
    }
    navigate(-1);
    handleCloseDelete();
  }

  const onDeleteAssetForUser = async () => {
    try {
      const res = await deAssignAsset({ variables: { id: assetStatus } });
      console.log("De", res);
      navigate(-1);
      toastAlert('success', 'Asset De-assigned Successfully!');
    }
    catch (error: any) {
      // console.log(error);
      toastAlert('error', error);
    }
    handleCloseAssetStatus();
  }

  useEffect(() => {
    const updatedUserId = localStorage.getItem("selectedUserId") || localStorage.getItem("userId");
    if (updatedUserId) {
      refetch({ id: updatedUserId }).then(({ data }) => {
        if (data?.user) {
          reset(data.user);
        }
      });
      refetchAssetData();
      refetchAssetByUser({ assigned_to: updatedUserId })
      refetchNotification({ user_id: updatedUserId });
    }
  }, [userId, refetch, reset, data]);

  const onSubmit = async (formData: any) => {
    try {
      const { data } = await updateUser({
        variables: {
          input: {
            id: userId || null, name: formData.name || null, email: formData.email || null, dob: formData.dob ? new Date(formData.dob).toISOString() : null, gender: formData.gender || null,
            blood_group: formData.blood_group || null, marital_status: formData.marital_status || null, phone: formData.phone || null, address: formData.address || null, designation: formData.designation || null,
            department: formData.department || null, city: formData.city || null, state: formData.state || null, pin_code: formData.pin_code || null, country: formData.country || null
          }
        }
      });
      console.log("Updated User",data);
      toastAlert('success', 'Saved Successfully!');
    } catch (error: any) {
      console.error("GraphQL Mutation Error:", error);
      toastAlert("error", `Failed to update profile: ${error.message}`);
    }
  };

  const { data: getNotifications, refetch: refetchNotification } = useQuery(GETNOTIFICATIONSBYID, { variables: { user_id: userId }, fetchPolicy: 'cache-only' });
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const openNotifications = Boolean(anchorEl);
  const handleClickNotifications = (e: any) => {
    setAnchorEl(e.currentTarget);
  };
  const handleCloseNotifications = () => {
    setAnchorEl(null);
  };

  const notifications = getNotifications?.getNotificationsById || [];
  const unseenCount = notifications.filter((notification: any) => notification.is_read === false).length;
  const approvedCount = notifications.filter((notification: any) => notification.approved).length;
  const rejectedCount = notifications.filter((notification: any) => notification.is_read && notification.approved === false).length;
  const tooltipTitle = `Unseen: ${unseenCount} | Approved: ${approvedCount} | Rejected: ${rejectedCount}`;
  let notificationList;
  if (notifications.length === 0) {
    notificationList = <MenuItem>No notifications</MenuItem>;
  }
  else {
    notificationList = notifications.map((notification: any) => {
      let statusText = "Not Seen";
      let statusColor = "blue";
      let StatusIcon = <VisibilityIcon sx={{ color: "blue", marginRight: "8px" }} />;
      if(notification.approved){
        statusColor = "green";
        statusText = "Approved";
        StatusIcon = <CheckCircleIcon sx={{ color: "green", marginRight: "8px" }} />;
      } 
      else if(notification.is_read && notification.approved === false){
        statusText = "Rejected";
        statusColor = "red";
        StatusIcon = <CancelIcon sx={{ color: "red", marginRight: "8px" }} />;
      }

      return (
        <MenuItem key={notification.id} sx={{ color: statusColor }}>
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            {StatusIcon}
            <div style={{ display: "flex", flexDirection: "column", marginLeft: "10px" }}>
              <span>Your Request: {notification.message}</span>
              <span style={{ fontSize: "12px", color: statusColor }}>{statusText}</span>
            </div>
          </div>
        </MenuItem>
      );
    });
  }

  return (
    <div className="userDashboard">
      <h2 className="userHeading">User Dashboard
        <Tooltip title={tooltipTitle} placement="bottom">
          <IconButton color="inherit" onClick={handleClickNotifications} style={{ marginLeft: "95%" }}>
            <Badge badgeContent={notifications.length} color="error"><NotificationsIcon /></Badge>
          </IconButton>
        </Tooltip>
      </h2>
      <Menu anchorEl={anchorEl} open={openNotifications} onClose={handleCloseNotifications}>
        {notificationList}
      </Menu>

      <ToggleButtonGroup value={selectedView} exclusive onChange={(_, newView) => {
        if (newView !== null) {
          setSelectedView(newView);
        }
      }}
        aria-label="user view toggle"
        style={{ marginBottom: "20px" }}
      >
        <ToggleButton value="profile">Profile</ToggleButton>
        <ToggleButton value="assets">Assets</ToggleButton>
      </ToggleButtonGroup>


      {selectedView === "profile" && (<form onSubmit={handleSubmit(onSubmit)} className="userForm">
        <div className="formMain">
          <div className="formContent">
            <label className="userLabel">Name<span style={{ color: 'red', background: 'none' }}>*</span></label>
            <input type="text" {...register("name", { required: "Name is required", minLength: { value: 3, message: "Name must be at least 3 characters" } })} className="userInput" disabled={!editEnable} onBlur={(e) => setValue("name", e.target.value.trim())} />
            {errors.name && <p className="formError">{errors.name.message}</p>}
          </div>
          <div className="formContent">
            <label className="userLabel">Email<span style={{ color: 'red', background: 'none' }}>*</span></label>
            <input type="email" {...register("email", { required: "Email is required", pattern: { value: /^[a-zA-Z0-9.]+@+[A-Za-z]+\.+com$/, message: 'Email must be valid' } })} className="userInput" disabled={!editEnable} onBlur={(e) => setValue("email", e.target.value.trim())} />
            {errors.email && <p className="formError">{errors.email.message}</p>}
          </div>
          <div className="formContent">
            <label className="userLabel">Date of Birth</label>
            <input type="date" {...register("dob", { required: "Date of Birth is required", validate: (value) => { const selectedDate = new Date(value); const today = new Date(); return selectedDate <= today || "Date of Birth selection is invalid" }, })} className="userInput" disabled={!editEnable} />
            {errors.dob && <p className="formError">{errors.dob.message}</p>}
          </div>
          <div className="formContent">
            <label className="userLabel">Gender</label>
            <select {...register("gender", { required: "Gender is required" })} className="userInput" disabled={!editEnable}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="formError">{errors.gender.message}</p>}
          </div>
          <div className="formContent">
            <label className="userLabel">Blood Group</label>
            <select {...register("blood_group", { required: "Blood Group is required" })} className="userInput" disabled={!editEnable}>
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            {errors.blood_group && <p className="formError">{errors.blood_group.message}</p>}
          </div>
          <div className="formContent">
            <label className="userLabel">Martial Status</label>
            <select {...register("marital_status", { required: "Marital Status is required" })} className="userInput" disabled={!editEnable}>
              <option value="">Select Martial Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widow">Widow</option>
              <option value="Divorcee">Divorcee</option>
            </select>
            {errors.marital_status && <p className="formError">{errors.marital_status.message}</p>}
          </div>
          <div className="formContent">
            <label className="userLabel">Phone</label>
            <input type="text" {...register("phone", { required: "Phone is required", validate: (value) => value !== "0000000000" || "Phone number cannot be all zeros", pattern: { value: /^[0-9]{10}$/, message: "Must be a 10 Digit Valid Phone Number" }, })} className="userInput" disabled={!editEnable} onBlur={(e) => setValue("phone", e.target.value.trim())} />
            {errors.phone && <p className="formError">{errors.phone.message}</p>}
          </div>
          <div className="formContent">
            <label className="userLabel">Designation</label>
            <input type="text" {...register("designation", { required: "Designation is required", minLength: { value: 2, message: "Designation must be at least 2 characters" } })} className="userInput" disabled={!editEnable} onBlur={(e) => setValue("designation", e.target.value.trim())} />
            {errors.designation && <p className="formError">{errors.designation.message}</p>}
          </div>
          <div className="formContent">
            <label className="userLabel">Department</label>
            <input type="text" {...register("department", { required: "Department is required", minLength: { value: 2, message: "Department must be at least 2 characters" } })} className="userInput" disabled={!editEnable} onBlur={(e) => setValue("department", e.target.value.trim())} />
            {errors.department && <p className="formError">{errors.department.message}</p>}
          </div>
          <div className="formContent">
            <label className="userLabel">City</label>
            <input type="text" {...register("city", { required: "City is required", minLength: { value: 2, message: "City must be at least 2 characters" } })} className="userInput" disabled={!editEnable} onBlur={(e) => setValue("city", e.target.value.trim())} />
            {errors.city && <p className="formError">{errors.city.message}</p>}
          </div>
          <div className="formContent">
            <label className="userLabel">State</label>
            <input type="text" {...register("state", { required: "State is required", minLength: { value: 2, message: "State must be at least 2 characters" } })} className="userInput" disabled={!editEnable} onBlur={(e) => setValue("state", e.target.value.trim())} />
            {errors.state && <p className="formError">{errors.state.message}</p>}
          </div>
          <div className="formContent">
            <label className="userLabel">Pin Code</label>
            <input type="text" {...register("pin_code", { required: "Pin Code is required", pattern: { value: /^[0-9]{6}$/, message: "Must be a 6 digit Pin code" } })} className="userInput" disabled={!editEnable} />
            {errors.pin_code && <p className="formError">{errors.pin_code.message}</p>}
          </div>
          <div className="formContent">
            <label className="userLabel">Country</label>
            <input type="text" {...register("country", { required: "Country is required", minLength: { value: 2, message: "Country must be at least 2 characters" } })} className="userInput" disabled={!editEnable} onBlur={(e) => setValue("country", e.target.value.trim())} />
            {errors.country && <p className="formError">{errors.country.message}</p>}
          </div>
          <div className="formContent fullWidth">
            <label className="userLabel">Address</label>
            <textarea {...register("address", { required: "Address is required", minLength: { value: 5, message: "Address must be atleast 5 charactes" } })} className="userInput" disabled={!editEnable} style={{ resize: 'none' }} onBlur={(e) => setValue("address", e.target.value.trim())} />
            {errors.address && <p className="formError">{errors.address.message}</p>}
          </div>
        </div>
        <div className="userButtons">
          {isAdmin ? (
            <>
              {data?.user?.status === 'Active' ?
                <>
                  <button type="button" className="userSubmit" onClick={handleOpen}>➕ Assign Asset</button>
                  <button type="button" className="userSubmit" onClick={handleOpenDelete}>Delete</button> </> : ''}
              <button type="button" className="userSubmit" onClick={() => navigate(-1)}>Cancel</button>
            </>
          ) : (
            <>
              <button type="button" className="userSubmit" onClick={handleOpenRequest}>📩 Request Asset</button>
              <button type="button" className="userSubmit" >Exchange Asset</button>
            </>
          )}
          {data?.user?.status === 'Active' ?
            <>
              <button type="button" className="userSubmit" onClick={() => setEditEnable(editEnable === false ? true : false)}>Edit</button>
              <button type="submit" className="userSubmit">Save</button></> : ''}

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Assign Asset for {data?.user?.name}</DialogTitle>
            <DialogContent>
              <FormControl sx={{ m: 1, minWidth: 500 }}>
                <InputLabel htmlFor="grouped-select">Device Type</InputLabel>
                <Select value={selectedType} id="grouped-select" label="Grouping" onChange={(e) => setSelectedType(e.target.value)}>
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="Laptop">Laptop</MenuItem>
                  <MenuItem value="Phone">Phone</MenuItem>
                  <MenuItem value="Tablet">Tablet</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogContent>
              {assignLoader && <AppLoaderComponent />}
              <FormControl sx={{ m: 1, minWidth: 500 }} disabled={!selectedType}>
                <InputLabel htmlFor="grouped-select">Device Name</InputLabel>
                <Select value={selectedAssetId} id="grouped-select" label="Grouping" onChange={(e) => setSelectedAssetId(e.target.value)}>
                  <MenuItem value=""><em>None</em></MenuItem>
                  {filtering?.map((asset: any) => (
                    <MenuItem key={asset.id} value={asset.id}>{asset.name} (Version: {asset.version})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">Close</Button>
              <Button onClick={() => { onAssignAsset() }} color="success" disabled={assignLoader}>Save</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openRequest} onClose={handleCloseRequest}>
            <DialogTitle>Request Asset</DialogTitle>
            <DialogContent>
              <FormControl sx={{ m: 1, minWidth: 500 }}>
                <InputLabel htmlFor="grouped-select">Type</InputLabel>
                <Select value={selectedType} id="grouped-select" label="Grouping" onChange={(e) => setSelectedType(e.target.value)}>
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="Laptop">Laptop</MenuItem>
                  <MenuItem value="Phone">Phone</MenuItem>
                  <MenuItem value="Tablet">Tablet</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogContent>
              <FormControl sx={{ m: 1, minWidth: 500 }} disabled={!selectedType}>
                <InputLabel htmlFor="grouped-select">Name</InputLabel>
                <Select value={selectedAssetId} id="grouped-select" label="Grouping" onChange={(e) => setSelectedAssetId(e.target.value)}>
                  <MenuItem value=""><em>None</em></MenuItem>
                  {filtering?.map((asset: any) => (
                    <MenuItem key={asset.id} value={asset.id}>{asset.name} (Version: {asset.version})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseRequest} color="primary">Close</Button>
              <Button onClick={() => { handleCloseRequest(); onRequestAsset(); }} color="success">Save</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openDelete} onClose={handleCloseDelete}>
            {deleteLoader && <AppLoaderComponent />}
            <DialogTitle><strong>Delete User</strong></DialogTitle>
            <DialogContent style={{ width: "500px" }}><p>Are You sure want to delete the user?</p></DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDelete} color="primary">Cancel</Button>
              <Button onClick={() => { onDeleteUser(); }} color="error" variant="contained">Delete</Button>
            </DialogActions>
          </Dialog>
        </div>
      </form>)}
      {selectedView === "assets" && (
        <div className="assetsContainer">
          {assetDataById.length === 0 ? (
            <p>No assets assigned to this user.</p>
          ) : (
            <div style={{ display: "grid", padding: "20px", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px" }}>
              {assetDataById.map((asset: any) => (
                <Card key={asset.id} sx={{ my: 2, borderRadius: 5, border: '2px solid #1976d2', cursor: "pointer", boxShadow: 3, transition: "0.3s", height: "300px", "&:hover": { transform: "scale(1.05)", boxShadow: 6 }, }} onClick={() => setAssetStatus(asset.id)}>
                  <CardActionArea sx={{ padding: 2, height: '100%' }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap='1' mb='1'>
                        <DevicesIcon color="primary" fontSize="medium" />
                        <Typography padding={1} fontWeight="bolder">{asset.name}</Typography>
                      </Box>
                      <Typography variant="body1" color="text.primary"><strong>Serial No:</strong> {asset.serial_no}</Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2" color="text.secondary"><strong>Type:</strong> {asset.type}</Typography>
                      <Typography variant="body2" color="text.secondary"><strong>Version:</strong> {asset.version}</Typography>
                      <Typography variant="body2" color="text.secondary"><strong>Specifications:</strong> {asset.specifications}</Typography>
                      <Typography variant="body2" color="text.secondary"><strong>Condition:</strong> {asset.condition}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </div>

            // ))
          )}
        </div>
      )}
      {isAdmin ? <Dialog open={openAssetStatus} onClose={handleCloseAssetStatus}>
        <DialogTitle><strong>Set Asset as Available</strong></DialogTitle>
        <DialogContent><p>Are You Sure want to Set the Asset as available?</p></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssetStatus} color="secondary">Cancel</Button>
          <Button onClick={onDeleteAssetForUser} color="primary">Set Available</Button>
        </DialogActions>
      </Dialog> : ''}

    </div>
  )
}

export default Users