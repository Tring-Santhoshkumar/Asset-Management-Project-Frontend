import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { CHANGEPASSWORD } from "./AdminUsersApi";
import { toastAlert } from "../../component/customComponents/toastify";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [changePassword] = useMutation(CHANGEPASSWORD);
  const token = localStorage.getItem("token") || "";
  const decodedData: any = jwtDecode(token);
  const userIdData = decodedData.id;

  const handleSubmit = async () => {
    try {
      await changePassword({ variables: { id: userIdData, password } });
      toastAlert('success', "Password changed successfully! Please log in again.");
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error(error);
      toastAlert('error', "Failed to change password.");
    }
  };

  return (
    <div style={{display:'flex', flexDirection:'column',gap:20, justifyContent:'center', alignContent:'center'}}>
      <h2>Change Password</h2>
      <TextField type="password" name="password" label="New Password" onChange={(e) => setPassword(e.target.value)} required style={{width:500}} />
      <Button variant="contained" color="primary" onClick={handleSubmit} style={{width:500}}>Change Password</Button>
    </div>
  );
};

export default ChangePassword;
