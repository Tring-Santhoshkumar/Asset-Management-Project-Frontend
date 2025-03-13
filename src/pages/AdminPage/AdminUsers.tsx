import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_USERS } from "./AdminUsersApi";
import { useState } from "react";
import Register from "../RegisterPage/Register";

const UsersPage = () => {

  const { data } = useQuery(GET_USERS);
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");

  const handleChange = (e: any) => {
    setFilter(e.target.value);
  }

  const filtering = data?.users?.filter((user: any) => {
    if (!filter) return true;
    return user?.role == filter;
  })

  const handleOpenAdd = () => {

  }

  return (
    <div className="usersContainer">
      <h2 className="adminUsersHeading">List of All Users</h2>
      <div style={{ display: 'flex' }}>
        <div className="formContent" style={{ marginBottom: '20px' }}>
          <select name="role" className="userInput" onChange={handleChange} required>
            <option value="">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>
        </div>
        <label className="userLabel" onClick={handleOpenAdd}><i className="pi pi-plus-circle" style={{ color: 'gray', fontSize: 40, paddingLeft: 20, paddingTop: 22, cursor: 'pointer' }}></i></label>
      </div>
      <div className="tableContainer">
        <table className="tableUsers">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtering?.map((user: any) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.gender}</td>
                <td>{user.designation}</td>
                <td>{user.department}</td>
                <td><button onClick={() => { localStorage.setItem("selectedUserId", user.id); navigate(`/admin/users/${user.id}`); }}>✏️ Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
