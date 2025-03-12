import { GETALLASSETS, GETASSETBYID } from './AssetsApi';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import 'primeicons/primeicons.css';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";

const Assets = () => {

  const { data } = useQuery(GETALLASSETS);
  const [selectedAssetId, setSelectedAssetId] = useState<any>();
  const { data: assetById } = useQuery(GETASSETBYID, { variables: { id: selectedAssetId } });
  // console.log(assetById);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleOpen = (id: Number) => {
    setOpen(true);
    setSelectedAssetId(id);
  }

  const handleClose = () => {
    setOpen(false);
    setSelectedAssetId(null);
  }

  const handleChange = (e: any) => {
    setFilter(e.target.value);
  }
  const filtering = data?.allAssets?.filter((asset: any) => {
    if (!filter) return true;
    return asset?.assigned_status == filter;
  })
  return (
    <div className="usersContainer">
      <h2 className="adminUsersHeading">List of All Assets</h2>
      <div className="formContent" style={{ marginBottom: '20px' }}>
        <label className="userLabel"><i className="pi pi-filter" style={{color:'gray'}}></i>Filter : </label>
        <select name="assigned_status" className="userInput" onChange={handleChange} required>
          <option value="">All Assets</option>
          <option value="Available">Available Assets</option>
          <option value="Assigned">Assigned Assets</option>
        </select>
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
              <td><button onClick={() => handleOpen(asset.id)}><i className="pi pi-arrow-circle-down" style={{color:'whitesmoke'}}></i>  View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="dialog-title">Asset Details for {assetById?.asset?.name}</DialogTitle>
        <DialogContent className="dialog-content" style={{width:'400px'}}>
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
    </div>
  )
}

export default Assets