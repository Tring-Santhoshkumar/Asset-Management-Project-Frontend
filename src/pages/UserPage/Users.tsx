import { useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { GETUSER, UPDATEUSER } from "./UsersApi";
import { toastAlert } from "../../component/customComponents/toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { ASSIGNASSET, GETALLASSETS, GETASSETBYID, REQUESTASSET } from "../AdminPage/AssetsApi";
import { useForm } from "react-hook-form";

interface UserIdProp {
  userId: String
}

const Users: React.FC<UserIdProp> = ({ userId }) => {

  // const { data } = useQuery(GETUSER, { variables: { id: userId } });

  const { data, loading, error, refetch } = useQuery(GETUSER, { variables: { id: userId } });

  const { data: assetData } = useQuery(GETALLASSETS);

  const { data: assetById } = useQuery(GETASSETBYID, { variables: { assigned_to: userId } });

  console.log(assetById);

  const [assignAsset] = useMutation(ASSIGNASSET);

  const [requestAsset] = useMutation(REQUESTASSET);

  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin/users");

  const selectedUserId = localStorage.getItem('selectedUserId');

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

  const [assetDataById, setAssetDataById] = useState<{ asset: any[] }>({ asset: [] });


  const filtering = assetData?.allAssets?.filter((asset: any) => asset.type == selectedType && asset.assigned_status == "Available");

  const assetDisplaying = () => {
    console.log("DATASS ", assetDataById);
  }

  const onAssignAsset = async () => {
    // console.log("Asset ID:", selectedAssetId);
    // console.log("User ID:", userId);
    try {
      const res = await assignAsset({ variables: { id: selectedAssetId, assigned_to: userId } });
      toastAlert('success', "Asset Assigned Successfully!");
    }
    catch (error) {
      console.error("Mutation Error:", error);
      toastAlert('error', "Asset Assigned Failed.");
    }
  };

  const onRequestAsset = async () => {
    try {
      // const res = await requestAsset({ variables: { id: selectedAssetId, assigned_to: userId } });
      // console.log("Mutation Response:", res);
      toastAlert('success', "Asset Requested Successfully,You'll be notified through mail!");
    }
    catch (error) {
      console.error("Mutation Error:", error);
      toastAlert('error', "Asset Assigned Failed.");
    }
  };

  useEffect(() => {
    if (data?.user) {
      reset(data.user);
    }
  }, [data, reset]);

  const onSubmit = async (formData: any) => {
    try {
      const { data } = await updateUser({
        variables: {
          id: userId, name: formData.name, email: formData.email, dob: formData.dob, gender: formData.gender,
          blood_group: formData.blood_group, marital_status: formData.marital_status, phone: formData.phone, address: formData.address, designation: formData.designation,
          department: formData.department, city: formData.city, state: formData.state, pin_code: formData.pin_code, country: formData.country, profile_pic: formData.profile_pic || "",
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

      <ToggleButtonGroup
        value={selectedView}
        exclusive
        onChange={(event, newView) => { setSelectedView(newView); setAssetDataById(assetById); console.log("assets : ", assetDataById); }}
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
            <label className="userLabel">Gender :</label>
            <select {...register("gender", { required: "Gender is required" })} className="userInput" disabled={!editEnable}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="formContent">
            <label className="userLabel">Blood Group :</label>
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
            <label className="userLabel">Martial Status :</label>
            <select {...register("marital_status", { required: "Marital Status is required" })} className="userInput" disabled={!editEnable}>
              <option value="">Select Martial Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widow">Widow</option>
              <option value="Divorcee">Divorcee</option>
            </select>
          </div>
          <div className="formContent">
            <label className="userLabel">Phone :</label>
            <input type="text" {...register("phone", { required: "Phone is required", pattern: { value: /^[0-9]{10}$/, message: "Must be a 10 Digit Valid Phone Number" }, })} className="userInput" disabled={!editEnable} />
            {errors.phone && <p className="error">{errors.phone.message}</p>}
          </div>
          <div className="formContent">
            <label className="userLabel">Designation :</label>
            <input type="text" {...register("designation", { required: "Designation is required" })} className="userInput" disabled={!editEnable} />
          </div>
          <div className="formContent">
            <label className="userLabel">Department :</label>
            <input type="text" {...register("department", { required: "Department is required" })} className="userInput" disabled={!editEnable} />
          </div>
          <div className="formContent">
            <label className="userLabel">City :</label>
            <input type="text" {...register("city", { required: "City is required" })} className="userInput" disabled={!editEnable} />
          </div>
          <div className="formContent">
            <label className="userLabel">State :</label>
            <input type="text" {...register("state", { required: "State is required" })} className="userInput" disabled={!editEnable} />
          </div>
          <div className="formContent">
            <label className="userLabel">Pin Code :</label>
            <input type="text" {...register("pin_code", { required: "Pin Code is required", pattern: { value: /^[0-9]{6}$/, message: "Must be a 6 digit Pin code" }, })} className="userInput" disabled={!editEnable} />
            {errors.pin_code && <p className="error">{errors.pin_code.message}</p>}
          </div>
          <div className="formContent">
            <label className="userLabel">Country :</label>
            <input type="text" {...register("country", { required: "Country is required" })} className="userInput" disabled={!editEnable} />
          </div>
          <div className="formContent fullWidth">
            <label className="userLabel">Address:</label>
            <textarea {...register("address", { required: "Address is required" })} className="userInput" disabled={!editEnable} />
          </div>
        </div>
        <div className="userButtons">
          {isAdmin ? (
            <><button type="button" className="userSubmit" onClick={handleOpen}>➕ Assign Asset</button>
              <button type="button" className="userSubmit" onClick={() => navigate(-1)}>Cancel</button></>
          ) : (
            <button type="button" className="userSubmit" onClick={handleOpenRequest}>📩 Request Asset</button>
          )}
          <button type="button" className="userSubmit" onClick={() => setEditEnable(editEnable == false ? true : false)}>Edit</button>
          <button type="submit" className="userSubmit">Save</button>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle className="dialog-title">Assign Asset for {data?.user?.name}</DialogTitle>
            <DialogContent className="dialog-content">
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
            <DialogContent className="dialog-content">
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
            <DialogActions className="dialog-actions">
              <Button onClick={handleClose} color="primary">Close</Button>
              <Button onClick={() => { handleClose(); onAssignAsset() }} color="success">Save</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openRequest} onClose={handleCloseRequest}>
            <DialogTitle className="dialog-title">Request Asset</DialogTitle>
            <DialogContent className="dialog-content">
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
            <DialogContent className="dialog-content">
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
            <DialogActions className="dialog-actions">
              <Button onClick={handleCloseRequest} color="primary">Close</Button>
              <Button onClick={() => { handleCloseRequest(); onRequestAsset(); }} color="success">Save</Button>
            </DialogActions>
          </Dialog>
        </div>
      </form>)}
      {/* {selectedView === "assets" && (
        <div className="assetsContainer">
          {selectedView === "assets" && (
            <>
              {console.log("Asset Data:", assetDataById, "Asset Length:", assetDataById?.asset?.length)}
              <div className="assetsContainer">
                {
                  assetDataById.asset.map((asset: any) => (
                    <Card key={asset.id} sx={{ minWidth: 275, marginBottom: 2 }}>
                      <CardContent>
                        <Typography variant="h5" component="div">{asset.name}</Typography>
                        <Typography color="text.secondary">Type: {asset.type}</Typography>
                        <Typography color="text.secondary">Version: {asset.version}</Typography>
                        <Typography color="text.secondary">Status: {asset.assigned_status}</Typography>
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            </>
          )}
        </div>
      )} */}
    </div>
  )
}

export default Users


