import { ADDASSET, GETALLASSETS, GETASSETBYID } from './AssetsApi';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import 'primeicons/primeicons.css';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";
import { toastAlert } from '../../component/customComponents/toastify';

interface AssetDataType {
  serial_no: string, type: string, name: string, version: string, specifications: string, condition: string, assigned_status: string
}

const Assets = () => {

  const { data } = useQuery(GETALLASSETS);

  const [selectedAssetId, setSelectedAssetId] = useState<any>();

  const { data: assetById } = useQuery(GETASSETBYID, { variables: { id: selectedAssetId } });

  const [addAsset] = useMutation(ADDASSET);

  // console.log(assetById);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

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

  const handleAddSubmit = async () => {
    const requiredFields = ["type", "serial_no", "name", "version", "specifications", "condition", "assigned_status"];

    const isValid = requiredFields.every(field => assetDetails[field as keyof AssetDataType]?.toString().trim());

    if (isValid == false) {
      toastAlert('error', 'Fill all the required fields');
      return;
    }
    try {
      const res = await addAsset({ variables: { type: assetDetails.type, serial_no: assetDetails.serial_no, name: assetDetails.name, version: assetDetails.version, specifications: assetDetails.specifications, condition: assetDetails.condition, assigned_status: assetDetails.assigned_status } });
      console.log('DATA', res);
      toastAlert('success', 'Asset Added Successfully');
    }
    catch (error) {
      toastAlert('error', 'Asset Added Successfully');
    }
    handleCloseAdd();
  };

  return (
    <div className="usersContainer">
      <h2 className="adminUsersHeading">List of All Assets</h2>
      <div style={{ display: 'flex' }}>
        <div className="formContent" style={{ marginBottom: '20px' }}>
          <label className="userLabel"><i className="pi pi-filter" style={{ color: 'gray', marginRight: 10 }}></i></label>
          <select name="assigned_status" className="userInput" onChange={handleChange} required>
            <option value="">All Assets</option>
            <option value="Available">Available Assets</option>
            <option value="Assigned">Assigned Assets</option>
          </select>
        </div>
        <label className="userLabel" onClick={handleOpenAdd}><i className="pi pi-plus-circle" style={{ color: 'gray', fontSize: 40, paddingLeft: 20, paddingTop: 22, cursor: 'pointer' }}></i></label>
      </div>
      <table className="tableUsers">
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Condition</th>
            <th>Assigned Status</th>
            <th>assigned_to</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtering?.map((asset: any) => (
            <tr key={asset.id}>
              <td>{asset.type}</td>
              <td>{asset.name}</td>
              <td>{asset.condition}</td>
              <td>{asset.assigned_status}</td>
              <td>{asset?.assigned_to ?? "-"}</td>
              <td><button onClick={() => handleOpen(asset.id)}><i className="pi pi-arrow-circle-down" style={{ color: 'whitesmoke' }}></i>  View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={open} onClose={handleClose}>
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
        </DialogActions>
      </Dialog>
      <Dialog open={openAddAsset} onClose={handleCloseAdd}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} color="primary">Cancel</Button>
          <Button onClick={() => { handleAddSubmit(); }} color="primary" variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Assets