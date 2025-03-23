import { ADDASSET, DELETEASSET, GETALLASSETS, GETASSETBYID } from './AssetsApi';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import 'primeicons/primeicons.css';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { AddCircleOutline, FilterList } from "@mui/icons-material";
import { toastAlert } from '../../component/customComponents/toastify';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { GETUSER } from '../UserPage/UsersApi';
import AppLoaderComponent from '../../component/customComponents/Loader/AppLoaderComponent';

interface AssetDataType {
  serial_no: string, type: string, name: string, version: string, specifications: string, condition: string, assigned_status: string
}

const Assets = () => {

  const { data, refetch } = useQuery(GETALLASSETS, {
    fetchPolicy: "no-cache"
  });

  const [selectedAssetId, setSelectedAssetId] = useState<any>();

  const { data: assetById } = useQuery(GETASSETBYID, { variables: { id: selectedAssetId } });

  const [addAsset] = useMutation(ADDASSET, {
    onCompleted() {
      refetch();
    }
  });

  const [deleteAsset] = useMutation(DELETEASSET, { onCompleted(){
    refetch();
  }})

  // console.log(assetById);
  const [filter, setFilter] = useState("");

  const [open, setOpen] = useState(false);

  const [openAddAsset, setOpenAddAsset] = useState(false);

  const handleOpen = (id: Number) => {
    setOpen(true);
    setSelectedAssetId(id);
  }

  const handleClose = () => {
    setOpen(false);
    setSelectedAssetId(null);
  }

  const handleOpenAdd = () => {
    setOpenAddAsset(true);
  }

  const handleCloseAdd = () => {
    setOpenAddAsset(false);
    
  }

  const handleChange = (e: any) => {
    setFilter(e.target.value);
  }
  const filtering = data?.allAssets?.filter((asset: any) => {
    if (!filter) return true;
    return asset?.assigned_status == filter;
  })

  const [assetDetails, setAssetDetails] = useState<AssetDataType>({ serial_no: "", type: "", name: "", version: "", specifications: "", condition: "New", assigned_status: "Available" });

  const handleChangeAdding = (e: any) => {
    const { name, value } = e.target;
    setAssetDetails({ ...assetDetails, [name]: value });
  };

  const [loader,setLoader] = useState(false);

  const [deleteLoader, setDeleteLoader] = useState(false);

  const handleAddSubmit = async () => {
    const requiredFields = ["type", "serial_no", "name", "version", "specifications", "condition", "assigned_status"];

    const isValid = requiredFields.every(field => assetDetails[field as keyof AssetDataType]?.toString().trim());

    setLoader(true);

    if (isValid == false) {
      toastAlert('error', 'Fill all the required fields');
      setLoader(false);
      return;
    }
    try {
      const res = await addAsset({ variables: { input: { type: assetDetails.type, serial_no: assetDetails.serial_no, name: assetDetails.name, version: assetDetails.version, specifications: assetDetails.specifications, condition: assetDetails.condition, assigned_status: assetDetails.assigned_status} } });
      console.log('DATA', res);
      toastAlert('success', 'Asset Added Successfully');
    }
    catch (error) {
      toastAlert('error', 'Asset Adding Failed.');
    }
    finally{
      setLoader(false);
    }
    handleCloseAdd();
  };

  const handleDeleteAsset = async (assetId: any) => {
    setDeleteLoader(true);
    try{
      const res = await deleteAsset({ variables: { id: assetId}});
      console.log('DELETE ASSET',res);
      toastAlert('success','Asset Deleted Successfully');
    }
    catch(error: any){
      toastAlert('error',error);
    }
    finally{
      setDeleteLoader(false);
    }
    handleClose();
  }

  return (
    <div className="usersContainer">
      <div className="headerSection">
        <h2 className="adminUsersHeading">List of All Assets</h2>
        <div className="actions">
          <div className="filterSelectContainer">
            <select className="filterSelect" name="assigned_status" onChange={handleChange} value={filter}>
              <option value="">All Assets</option>
              <option value="Available">Available Assets</option>
              <option value="Assigned">Assigned Assets</option>
            </select>
          </div>
          <button className="addButton" onClick={handleOpenAdd}><AddCircleOutline/> Add Asset</button>
        </div>
      </div>
      <TableContainer component={Paper} style={{ maxHeight: 540, overflowY: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {["Serial No", "Type", "Name", "Condition", "Assigned Status", "Details"].map((header) => (
                <TableCell key={header} sx={{ backgroundColor: "#1976d2", color: "white", fontWeight: "bold" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtering?.map((asset: any) => (
              <TableRow key={asset.id} hover>
                <TableCell>{asset.serial_no}</TableCell>
                <TableCell>{asset.type}</TableCell>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.condition}</TableCell>
                <TableCell>{asset.assigned_status}</TableCell>
                <TableCell><button onClick={() => handleOpen(asset.id)} className="viewButton"><RemoveRedEyeIcon/></button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        {deleteLoader && <AppLoaderComponent />}
        <DialogTitle className="dialog-title">Asset Details for {assetById?.asset?.name}</DialogTitle>
        <DialogContent className="dialog-content" style={{ width: '400px' }}>
          {assetById?.asset && (
            <div>
              <p><strong>Name :</strong> {assetById.asset.name}</p>
              <p><strong>Type :</strong> {assetById.asset.type}</p>
              <p><strong>Version :</strong> {assetById.asset.version}</p>
              <p><strong>Specifications :</strong> {assetById.asset.specifications}</p>
              <p><strong>Condition :</strong> {assetById.asset.condition}</p>
              <p><strong>Assigned To :</strong> {assetById.asset.assigned_to ?? " - "}</p>
              <p><strong>Status :</strong> {assetById.asset.assigned_status}</p>
              <p><strong>Return Date :</strong> {assetById.asset.return_date ?? " - "}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleClose} color="primary">Close</Button>
          <Button onClick={() =>handleDeleteAsset(assetById?.asset?.id)} color='error' variant='contained'>Delete</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAddAsset} onClose={handleCloseAdd}>
        {loader && <AppLoaderComponent />}
      <DialogTitle color='primary'>Add Asset</DialogTitle>
        <DialogContent style={{ width: "500px" }}>
          <TextField fullWidth label="Serial No" name="serial_no" value={assetDetails.serial_no} onChange={handleChangeAdding} margin="dense" required />
          <TextField fullWidth label="Type" name="type" value={assetDetails.type} onChange={handleChangeAdding} margin="dense" required />
          <TextField fullWidth label="Name" name="name" value={assetDetails.name} onChange={handleChangeAdding} margin="dense" required />
          <TextField fullWidth label="Version" name="version" value={assetDetails.version} onChange={handleChangeAdding} margin="dense" required />
          <TextField fullWidth label="Specifications" name="specifications" value={assetDetails.specifications} onChange={handleChangeAdding} margin="dense" required multiline />
          <TextField select fullWidth label="Condition" name="condition" value={assetDetails.condition} onChange={handleChangeAdding} margin="dense" required>
            {["New", "Good", "Damaged", "Needs Repair"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField select fullWidth label="Status" name="assigned_status" value={assetDetails.assigned_status} onChange={handleChangeAdding} margin="dense" required>
            {["Assigned", "Available"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          {/* {assetDetails.assigned_status === "Assigned" && (
          <TextField select fullWidth label="Assign To" name="assigned_to" value={assetDetails.assigned_to} onChange={handleChangeAdding} margin="dense" required>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>)} */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} color="primary">Cancel</Button>
          <Button onClick={() => { handleAddSubmit(); }} color="primary" variant="contained" >Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Assets