import { useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { GETUSER, UPDATEUSER } from "./UsersApi";
import { toastAlert } from "../../component/toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, ListSubheader, MenuItem, Select } from "@mui/material";
import { GETALLASSETS } from "../AdminPage/AssetsApi";

interface userIdProp {
  userId: String
}

const Users: React.FC<userIdProp> = ({ userId }) => {

  // const { data } = useQuery(GETUSER, { variables: { id: userId } });

  const { data, loading, error } = useQuery(GETUSER, { variables: { id: userId } });
  const { data : assetData} = useQuery(GETALLASSETS);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin/users");
  const selectedUserId = localStorage.getItem('selectedUserId');
  // console.log(selectedUserId);
  const navigate = useNavigate();
  const [assignAsset, setAssignAsset] = useState(false);

  const [requestAsset, setRequestAsset] = useState(false);

  const [updateUser] = useMutation(UPDATEUSER);

  const [editEnable, setEditEnable] = useState<Boolean>(false);

  const [formData, setFormData] = useState({
    name: "", email: "", dob: "", gender: "", blood_group: "", marital_status: "",
    phone: "", address: "", profile_pic: "", designation: "", department: "", city: "", state: "", pin_code: "", country: ""
  });


  useEffect(() => {
    if (data?.user) {
      setFormData({
        name: data.user.name || "", email: data.user.email || "", dob: typeof data.user.dob === "string" ? data.user.dob.split("T")[0] : "", gender: data.user.gender || "",
        blood_group: data.user.blood_group || "", marital_status: data.user.marital_status || "", phone: data.user.phone || "",
        address: data.user.address || "", profile_pic: data.user.profile_pic || "", designation: data.user.designation || "", department: data.user.department || "",
        city: data.user.city || "", state: data.user.state || "", pin_code: data.user.pin_code || "", country: data.user.country || ""
      })
    }
  }, [data])


  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }


  // const handleSubmit = async () => {
  //   try{
  //     await updateUser({ variables: { id: userId, ...formData } });
  //     toastAlert('success','Saved Successfully!');
  //   }
  //   catch (error: any) {
  //     console.error("GraphQL Mutation Error:", error);
  //     toastAlert("error", `Failed to update profile: ${error.message}`);
  //   }
  // }
  const handleSubmit = async () => {
    try {
      await updateUser({ variables: { id: userId, ...formData, dob: formData.dob ? formData.dob : null, } });
      toastAlert('success', 'Saved Successfully!');
    } catch (error: any) {
      console.error("GraphQL Mutation Error:", error);
      toastAlert("error", `Failed to update profile: ${error.message}`);
    }
  };
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }

  const assignFunction = () => {
    
  }


  return (
    <div className="userDashboard">
      <h2 className="userHeading">User Dashboard</h2>
      <form onSubmit={(e) => e.preventDefault()} className="userForm">
        <div className="formMain">
          <div className="formContent">
            <label className="userLabel">Name :</label>
            <input type="text" name="name" className="userInput" value={formData.name} onChange={handleChange} disabled={!editEnable} required />
          </div>
          <div className="formContent">
            <label className="userLabel">Email :</label>
            <input type="email" name="email" className="userInput" value={formData.email} onChange={handleChange} disabled={!editEnable} required />
          </div>
          <div className="formContent">
            <label className="userLabel">Date of Birth :</label>
            <input type="date" name="dob" className="userInput" value={formData.dob} onChange={handleChange} disabled={!editEnable} required />
          </div>
          <div className="formContent">
            <label className="userLabel">Gender :</label>
            <select name="gender" className="userInput" value={formData.gender} onChange={handleChange} disabled={!editEnable} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="formContent">
            <label className="userLabel">Blood Group :</label>
            <select name="blood_group" className="userInput" value={formData.blood_group} onChange={handleChange} disabled={!editEnable} required>
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
            <select name="marital_status" className="userInput" value={formData.marital_status} onChange={handleChange} disabled={!editEnable} required>
              <option value="">Select Martial Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widow">Widow</option>
              <option value="Divorcee">Divorcee</option>
            </select>
          </div>
          <div className="formContent">
            <label className="userLabel">Phone :</label>
            <input type="text" name="phone" className="userInput" value={formData.phone} onChange={handleChange} disabled={!editEnable} required />
          </div>
          <div className="formContent">
            <label className="userLabel">Designation :</label>
            <input type="text" name="designation" className="userInput" value={formData.designation} onChange={handleChange} disabled={!editEnable} required />
          </div>
          <div className="formContent">
            <label className="userLabel">Department :</label>
            <input type="text" name="department" className="userInput" value={formData.department} onChange={handleChange} disabled={!editEnable} required />
          </div>
          <div className="formContent">
            <label className="userLabel">City :</label>
            <input type="text" name="city" className="userInput" value={formData.city} onChange={handleChange} disabled={!editEnable} required />
          </div>
          <div className="formContent">
            <label className="userLabel">State :</label>
            <input type="text" name="state" className="userInput" value={formData.state} onChange={handleChange} disabled={!editEnable} required />
          </div>
          <div className="formContent">
            <label className="userLabel">Pin Code :</label>
            <input type="text" name="pin_code" className="userInput" value={formData.pin_code} onChange={handleChange} disabled={!editEnable} required />
          </div>
          <div className="formContent">
            <label className="userLabel">Country :</label>
            <input type="text" name="country" className="userInput" value={formData.country} onChange={handleChange} disabled={!editEnable} required />
          </div>
          <div className="formContent fullWidth">
            <label className="userLabel">Address:</label>
            <textarea name="address" className="userInput" value={formData.address} onChange={handleChange} disabled={!editEnable} required />
          </div>
        </div>
        {/* <div className="userButtons">
          <button type="submit" className="userSubmit" onClick={() => setEditEnable(true)}>Edit</button>
          <button type="submit" className="userSubmit" onClick={() => {setEditEnable(false); handleSubmit()}}>Save</button>
        </div> */}
        <div className="userButtons">
          {isAdmin ? (
            <><button type="button" className="userSubmit" onClick={handleClickOpen}>➕ Assign Asset</button>
              <button type="button" className="userSubmit" onClick={() => navigate(-1)}>Cancel</button></>
          ) : (
            <button type="button" className="userSubmit" onClick={() => setRequestAsset(true)}>📩 Request Asset</button>
          )}
          <button type="button" className="userSubmit" onClick={() => setEditEnable(true)}>Edit</button>
          <button type="submit" className="userSubmit" onClick={() => { setEditEnable(false); handleSubmit() }}>Save</button>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle className="dialog-title">Assign Asset for {data?.user?.name}</DialogTitle>
            <DialogContent className="dialog-content">
              <FormControl sx={{ m: 1, minWidth: 200 }}>
                <InputLabel htmlFor="grouped-select">Type</InputLabel>
                <Select defaultValue="" id="grouped-select" label="Grouping">
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="Laptop">Laptop</MenuItem>
                  <MenuItem value="Phone">Phone</MenuItem>
                  <MenuItem value="Tablet">Tablet</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogContent className="dialog-content">
              <FormControl sx={{ m: 1, minWidth: 200 }}>
                <InputLabel htmlFor="grouped-select">Name</InputLabel>
                <Select defaultValue="" id="grouped-select" label="Grouping">
                  <MenuItem value=""><em>None</em></MenuItem>
                  {assetData?.allAssets?.map((asset: any) => (
                      <MenuItem key={asset?.id} value={asset?.name}>{asset?.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions className="dialog-actions">
              <Button onClick={handleClose} color="primary">Close</Button>
              <Button onClick={() => {handleClose(); assignFunction();}} color="success">Save</Button>
            </DialogActions>
          </Dialog>
        </div>
      </form>
    </div>
  )
}

export default Users

