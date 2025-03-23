import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, InputAdornment, IconButton } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { CHANGEPASSWORD } from "../AdminPage/AdminUsersApi";
import { toastAlert } from "../../component/customComponents/toastify";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [userID, setUserID] = useState();
  const [changePassword] = useMutation(CHANGEPASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    try {
      if (!token) {
        throw new Error("No token found");
      }
      const decodedData: any = jwtDecode(token);
      if (!decodedData.id) {
        throw new Error("Invalid token structure");
      }
      setUserID(decodedData.id);
    } catch (err) {
      toastAlert("error", "Session expired. Please log in again.");
      localStorage.clear();
      navigate("/");
    }
  }, [navigate]);
  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const handleSubmit = async () => {
    try {
      await changePassword({ variables: { id: userID, password } });
      toastAlert('success', "Password changed successfully! Please log in again.");
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error(error);
      toastAlert('error', "Failed to change password.");
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100vh", justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5", fontFamily: "'Inter', sans-serif", }}>
      <Box sx={{ width: "400px", background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", textAlign: "center", }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2", marginBottom: "20px" }}>Change Password</Typography>
        <TextField type={showPassword ? "text" : "password"} name="password" label="New Password" fullWidth onChange={(e) => setPassword(e.target.value)} required
          sx={{ marginBottom: "20px" }} InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ padding: "12px", fontSize: "16px", borderRadius: "5px", cursor: "pointer", transition: "background 0.3s", "&:hover": { backgroundColor: "#177ce2" }, }}>
          Change Password
        </Button>
      </Box>
    </Box>
  );

};

export default ChangePassword;
