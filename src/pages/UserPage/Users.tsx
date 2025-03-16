import { useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { DEASSIGNASSET, DELETEUSER, GETUSER, UPDATEUSER } from "./UsersApi";
import { toastAlert } from "../../component/customComponents/toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { ASSIGNASSET, GETALLASSETS, GETASSETBYID, GETASSETBYUSERID, REQUESTASSET } from "../AdminPage/AssetsApi";
import { useForm } from "react-hook-form";
import { CREATE_NOTIFICATION } from "../AdminPage/NotificationsApi";

interface UserIdProp {
  userId: String
}

const Users: React.FC<UserIdProp> = ({ userId }) => {

  // const { data } = useQuery(GETUSER, { variables: { id: userId } });

  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin/users");

  const selectedUserId = localStorage.getItem('selectedUserId');

  const { data, loading, error, refetch } = useQuery(GETUSER, { variables: { id: userId }, fetchPolicy: "no-cache" });

  const { data: assetData } = useQuery(GETALLASSETS);

  const { data: assetByUserId, refetch: refetchAssetByUser } = useQuery(GETASSETBYUSERID, { variables: { assigned_to: userId }, fetchPolicy: "no-cache" });

  const [createNotification] = useMutation(CREATE_NOTIFICATION);

  const [assignAsset] = useMutation(ASSIGNASSET);

  const [requestAsset] = useMutation(REQUESTASSET);

  const [deleteUser] = useMutation(DELETEUSER);

  const [deAssignAsset] = useMutation(DEASSIGNASSET);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: "", email: "", dob: "", gender: "",
      blood_group: "", marital_status: "", phone: "", address: "", designation: "", department: "", city: "", state: "", pin_code: "", country: "", profile_pic: "",
    },
  });

  const navigate = useNavigate();

  const [updateUser] = useMutation(UPDATEUSER);

  const [editEnable, setEditEnable] = useState<Boolean>(false);

  const [open, setOpen] = useState(false);

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

  const [assetStatus,setAssetStatus] = useState();

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


  const filtering = assetData?.allAssets?.filter((asset: any) => asset.type == selectedType && asset.assigned_status == "Available");

  const onAssignAsset = async () => {
    try {
      const updatedUserId = localStorage.getItem("selectedUserId") || userId;
      const res = await assignAsset({ variables: { id: selectedAssetId, assigned_to: updatedUserId } });
      // console.log('RESULT : ',res);
      toastAlert('success', "Asset Assigned Successfully!");
      await refetchAssetByUser();
    }
    catch (error) {
      console.error("Mutation Error:", error);
      toastAlert('error', "Asset Assigned Failed.");
    }
  };

  const onRequestAsset = async () => {
    try {
      const res = await requestAsset({ variables: { id: selectedAssetId } });
      // console.log("Mutation Response:", res);
      const selectedUser = data?.user?.name;
      const selectedAsset = assetData?.allAssets?.find((asset: any) => asset.id === selectedAssetId);
      const msg = `User ${selectedUser} requested asset ${selectedAsset.name}.`
      // console.log('Filter : ',selectedUser,selectedAsset.name,msg);
      await createNotification({
        variables: {
          user_id: userId,
          asset_id: selectedAssetId,
          message: msg,
        }
      });
      toastAlert('success', "Asset Requested Successfully,You'll be notified through mail!");
    }
    catch (error) {
      console.error("Mutation Error:", error);
      toastAlert('error', "Asset Assigned Failed.");
    }
  };

  const onDeleteUser = async () => {
    try {
      const res = await deleteUser({ variables: { id: userId } });
      // console.log("Mutation Response:", res);
      toastAlert('success', "User Deleted Successfull!");
    }
    catch (error) {
      console.error("Mutation Error:", error);
      toastAlert('error', "User deletion Failed.");
    }
    navigate(-1);
    handleCloseDelete();
  }

  const onDeleteAssetForUser = async () => {
    try{
      const res = await deAssignAsset({ variables: { id : assetStatus}});
      console.log("De",res);
      toastAlert('success','Asset De-assigned Successfully!');
    }
    catch(error : any){
      // console.log(error);
      toastAlert('error',error);
    }
    navigate(-1);
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
    }
  }, [userId, refetch, reset, data]);

  // useEffect(() => {
  //   if (data?.user) {
  //     refetch();
  //     reset(data.user);
  //   }
  // }, [data, reset]);

  const onSubmit = async (formData: any) => {
    try {
      const { data } = await updateUser({
        variables: {
          id: userId || null, name: formData.name || null, email: formData.email || null, dob: formData.dob || null, gender: formData.gender || null,
          blood_group: formData.blood_group || null, marital_status: formData.marital_status || null, phone: formData.phone || null, address: formData.address || null, designation: formData.designation || null,
          department: formData.department || null, city: formData.city || null, state: formData.state || null, pin_code: formData.pin_code || null, country: formData.country || null, profile_pic: formData.profile_pic || null,
        }
      });
      toastAlert('success', 'Saved Successfully!');

    } catch (error: any) {
      console.error("GraphQL Mutation Error:", error);
      toastAlert("error", `Failed to update profile: ${error.message}`);
    }
  };

  return (
    <div className="userDashboard">
      <h2 className="userHeading">User Dashboard</h2>

      <ToggleButtonGroup value={selectedView} exclusive onChange={(event, newView) => {
        if (newView !== null) {
          setSelectedView(newView);
          refetchAssetByUser();
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
            <input type="text" {...register("name", { required: "Name is required" })} className="userInput" disabled={!editEnable} />
            {errors.name && <p className="error">{errors.name.message}</p>}
          </div>
          <div className="formContent">
            <label className="userLabel">Email<span style={{ color: 'red', background: 'none' }}>*</span></label>
            <input type="email" {...register("email", { required: "Email is required" })} className="userInput" disabled={!editEnable} />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          <div className="formContent">
            <label className="userLabel">Date of Birth</label>
            <input type="date" {...register("dob", { required: "Date of Birth is required" })} className="userInput" disabled={!editEnable} />
            {errors.dob && <p className="error">{errors.dob.message}</p>}
          </div>
          <div className="formContent">
            <label className="userLabel">Gender</label>
            <select {...register("gender", { required: "Gender is required" })} className="userInput" disabled={!editEnable}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
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
          </div>
          <div className="formContent">
            <label className="userLabel">Phone</label>
            <input type="text" {...register("phone", { required: "Phone is required", pattern: { value: /^[0-9]{10}$/, message: "Must be a 10 Digit Valid Phone Number" }, })} className="userInput" disabled={!editEnable} />
            {errors.phone && <p className="error">{errors.phone.message}</p>}
          </div>
          <div className="formContent">
            <label className="userLabel">Designation</label>
            <input type="text" {...register("designation", { required: "Designation is required" })} className="userInput" disabled={!editEnable} />
          </div>
          <div className="formContent">
            <label className="userLabel">Department</label>
            <input type="text" {...register("department", { required: "Department is required" })} className="userInput" disabled={!editEnable} />
          </div>
          <div className="formContent">
            <label className="userLabel">City</label>
            <input type="text" {...register("city", { required: "City is required" })} className="userInput" disabled={!editEnable} />
          </div>
          <div className="formContent">
            <label className="userLabel">State</label>
            <input type="text" {...register("state", { required: "State is required" })} className="userInput" disabled={!editEnable} />
          </div>
          <div className="formContent">
            <label className="userLabel">Pin Code</label>
            <input type="text" {...register("pin_code", { required: "Pin Code is required", pattern: { value: /^[0-9]{6}$/, message: "Must be a 6 digit Pin code" }, })} className="userInput" disabled={!editEnable} />
            {errors.pin_code && <p className="error">{errors.pin_code.message}</p>}
          </div>
          <div className="formContent">
            <label className="userLabel">Country</label>
            <input type="text" {...register("country", { required: "Country is required" })} className="userInput" disabled={!editEnable} />
          </div>
          <div className="formContent fullWidth">
            <label className="userLabel">Address</label>
            <textarea {...register("address", { required: "Address is required" })} className="userInput" disabled={!editEnable} style={{ resize: 'none' }} />
          </div>
        </div>
        <div className="userButtons">
          {isAdmin ? (
            <><button type="button" className="userSubmit" onClick={handleOpen}>➕ Assign Asset</button>
              <button type="button" className="userSubmit" onClick={() => navigate(-1)}>Cancel</button>
              <button type="button" className="userSubmit" onClick={handleOpenDelete}>Delete</button></>
          ) : (
            <button type="button" className="userSubmit" onClick={handleOpenRequest}>📩 Request Asset</button>
          )}
          <button type="button" className="userSubmit" onClick={() => setEditEnable(editEnable == false ? true : false)}>Edit</button>
          <button type="submit" className="userSubmit">Save</button>

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
              <Button onClick={() => { handleClose(); onAssignAsset() }} color="success">Save</Button>
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
            assetDataById.map((asset: any) => (
              <Card key={asset.id} sx={{ minWidth: 275, marginBottom: 2, cursor: 'pointer' }} onClick={() =>{ setAssetStatus(asset.id);}}>
                <CardContent>
                  <Typography variant="h4" component="div">{asset.name}</Typography>
                  <Typography variant="h6" component="div">Serial_No : {asset.serial_no}</Typography>
                  <Typography color="text.secondary">Type : {asset.type}</Typography>
                  <Typography color="text.secondary">Version : {asset.version}</Typography>
                  <Typography color="text.secondary">Specifications : {asset.specifications}</Typography>
                  <Typography color="text.secondary">Condition : {asset.condition}</Typography>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
      <Dialog open={openAssetStatus} onClose={handleCloseAssetStatus}>
        <DialogTitle><strong>Set Asset as Available</strong></DialogTitle>
        <DialogContent><p>Are You Sure want to Set the Asset as available?</p></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssetStatus} color="secondary">Cancel</Button>
          <Button onClick={onDeleteAssetForUser} color="primary">Set Available</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Users


