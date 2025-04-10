import { ADDASSET, DELETEASSET, GETALLASSETS, GETALLASSETSPAGINATION, GETASSETBYID } from './AssetsApi';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import 'primeicons/primeicons.css';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Table, 
  TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import { toastAlert } from '../../component/customComponents/toastify';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AppLoaderComponent from '../../component/customComponents/Loader/AppLoaderComponent';

interface AssetDataType {
  serial_no: string,
  type: string, 
  name: string, 
  version: string, 
  specifications: string, 
  condition: string, 
  assigned_status: string
}

const Assets = () => {

  // const { data, refetch } = useQuery(GETALLASSETS, {
  //   fetchPolicy: "no-cache"
  // });

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>();

  const [getAssetById, { data: assetById }] = useLazyQuery(GETASSETBYID);

  const [addAsset] = useMutation(ADDASSET, {
    onCompleted() {
      refetch();
    }
  });

  const [deleteAsset] = useMutation(DELETEASSET, {
    onCompleted() {
      refetch();
    }
  })

  const [filter, setFilter] = useState("");

  const [open, setOpen] = useState(false);

  const [openAddAsset, setOpenAddAsset] = useState(false);

  const handleOpen = (id: string) => {
    setOpen(true);
    setSelectedAssetId(id);
    getAssetById({ variables: { id } });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilter(e.target.value);
    setPage(1);
    refetch({ page: 1, limit: rowsPerPage, assigned_status: e.target.value || null });
  }

  const [assetDetails, setAssetDetails] = useState<AssetDataType>({ serial_no: "", type: "", name: "", version: "", specifications: "", condition: "New", assigned_status: "Available" });

  const handleChangeAdding = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAssetDetails({ ...assetDetails, [name]: value });
  };

  const [loader, setLoader] = useState(false);

  const [deleteLoader, setDeleteLoader] = useState(false);

  const handleAddSubmit = async () => {
    const requiredFields = ["type", "serial_no", "name", "version", "specifications", "condition", "assigned_status"];

    const isValid = requiredFields.every(field => assetDetails[field as keyof AssetDataType]?.toString().trim());

    setLoader(true);

    try {
      if (isValid === false) {
        toastAlert('error', 'Fill all the required fields');
      }
      else {
        const res = await addAsset({ variables: { input: { type: assetDetails.type, serial_no: assetDetails.serial_no, name: assetDetails.name, version: assetDetails.version, specifications: assetDetails.specifications, condition: assetDetails.condition, assigned_status: assetDetails.assigned_status } } });
        console.log('DATA', res);
        toastAlert('success', 'Asset Added Successfully');
      }
    }
    catch (error) {
      toastAlert('error', 'Asset Adding Failed.');
    }
    finally {
      setLoader(false);
    }
    refetch();
    handleCloseAdd();
  };

  const handleDeleteAsset = async (assetId: string) => {
    setDeleteLoader(true);
    try {
      const res = await deleteAsset({ variables: { id: assetId } });
      console.log('DELETE ASSET', res);
      toastAlert('success', 'Asset Deleted Successfully');
    }
    catch (error: any) {
      toastAlert('error', error);
    }
    finally {
      setDeleteLoader(false);
    }
    handleClose();
  }

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data: allAssetsPagination, refetch } = useQuery(GETALLASSETSPAGINATION, { variables: { page, limit: rowsPerPage, assigned_status: filter || null }, fetchPolicy: "no-cache" });
  const handlePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
    refetch({ page: newPage + 1, limit: rowsPerPage, assigned_status: filter || null });
  };
  const handleRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(1);
    refetch({ page: 1, limit: parseInt(event.target.value, 10), assigned_status: filter || null });
  };

  const filtering = allAssetsPagination?.getAllAssetsPagination?.assets || [];

  const returnDate = assetById?.asset?.return_date && assetById?.asset?.return_date.split('T')[0];

  return (
    <div className="usersContainer">
      <div className="headerSection">
        <h2 className="adminUsersHeading">List of All Assets</h2>
        <div className="actions">
          <div className="filterSelectContainer">
            <select className="filterSelect" name="assigned_status" onChange={handleChange} value={filter}>
              <option value="">All Assets</option>
              <option value="AVAILABLE">Available Assets</option>
              <option value="ASSIGNED">Assigned Assets</option>
            </select>
          </div>
          <button className="addButton" onClick={handleOpenAdd}><AddCircleOutline /> Add Asset</button>
        </div>
      </div>
      <TableContainer component={Paper} style={{ maxHeight: "490px", overflowY: "auto" }}>
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
            {filtering?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">No users found.</TableCell>
              </TableRow>
            )}
            {filtering?.map((asset: any) => (
              <TableRow key={asset.id} hover>
                <TableCell>{asset.serial_no}</TableCell>
                <TableCell>{asset.type}</TableCell>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.condition}</TableCell>
                <TableCell>{asset.assigned_status}</TableCell>
                <TableCell>
                  <button onClick={() => { handleOpen(asset.id); }} className="viewButton">
                    <RemoveRedEyeIcon />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className='pagination'>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={allAssetsPagination?.getAllAssetsPagination?.totalCount || 0}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            onPageChange={handlePage}
            onRowsPerPageChange={handleRowsPerPage}
          /></div>
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
              <p><strong>Assigned To :</strong> {assetById.asset?.assignedTo?.name ?? " - "}</p>
              <p><strong>Status :</strong> {assetById.asset.assigned_status}</p>
              <p><strong>Return Date :</strong> {returnDate ?? " - "}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleClose} color="primary">Close</Button>
          <Button onClick={() => handleDeleteAsset(assetById?.asset?.id)} color='error' variant='contained'>Delete</Button>
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
