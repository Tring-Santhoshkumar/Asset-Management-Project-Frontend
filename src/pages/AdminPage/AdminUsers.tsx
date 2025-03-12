import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_USERS } from "./AdminUsersApi";
import { useState } from "react";

const UsersPage = () => {
  const { data } = useQuery(GET_USERS);
  const navigate = useNavigate();
  const [filter,setFilter] = useState("");
  const handleChange = (e : any) => {
      setFilter(e.target.value);
  }
  const filtering = data?.users?.filter((user : any) => {
    if(!filter) return true;
    return user?.role == filter;
  })
  
  return (
    <div className="usersContainer">
      <h2 className="adminUsersHeading">List of All Users</h2>
      <div className="formContent"  style={{marginBottom:'20px'}}>
            <label className="userLabel">Filter : </label>
            <select name="role" className="userInput" onChange={handleChange} required>
              <option value="">All Roles</option>
              <option value="admin">Admins</option>
              <option value="user">Users</option>
            </select>
      </div>
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
          {filtering?.map((user : any) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.gender}</td>
              <td>{user.designation}</td>
              <td>{user.department}</td>
              <td><button onClick={() => { localStorage.setItem("selectedUserId", user.id); navigate(`/admin/users/${user.id}`);}}>✏️ Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
