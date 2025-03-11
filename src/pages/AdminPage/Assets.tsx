import { GETALLASSETS } from './AssetsApi';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useState } from 'react';

const Assets = () => {

  const { data } = useQuery(GETALLASSETS);
  const [filter,setFilter] = useState("");
  const navigate = useNavigate();
  const handleChange = (e : any) => {
    setFilter(e.target.value);
  }
  const filtering = data?.allAssets?.filter((asset : any) => {
    if(!filter) return true;
    return asset?.assigned_status == filter;
  })
  return (
    <div className="usersContainer">
      <h2 className="adminUsersHeading">List of All Assets</h2>
      <div className="formContent" style={{marginBottom:'20px'}}>
            <label className="userLabel">Filter : </label>
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
          {filtering?.map((asset : any) => (
            <tr key={asset.id}>
              <td>{asset.type}</td>
              <td>{asset.name}</td>
              <td>{asset.condition}</td>
              <td>{asset.assigned_status}</td>
              <td>{asset?.assigned_to ?? "Null"}</td>
              <td><button>✏️ Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Assets