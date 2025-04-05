import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      gender
      designation
      department
      role
      status
      assets{
        id
        serial_no
        name
        type
      }
    }
  }
`;

export const PAGINATEDUSERS = gql`
  query GetUsersPagination($page: Int!,$limit: Int!){
    paginatedUsers(page: $page, limit: $limit){
      users{
        id
        name
        email
        gender
        designation
        department
        role
        status
        assets{
          id
          serial_no
          name
          type
        }
      }
      totalCount
    }
  }
`


export const ADDUSER = gql`
  mutation AddUser($name: String!, $email: String!, $role: String!){
    addUser(name: $name, email: $email, role: $role)
  }
`


export const CHANGEPASSWORD = gql`
  mutation ChangePassword($id: String!,$password: String!){
    changePassword(id: $id,password: $password)
  }
`
