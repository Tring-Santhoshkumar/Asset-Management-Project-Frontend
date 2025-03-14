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
    }
  }
`;


export const ADDUSER = gql`
  mutation AddUser($name: String!, $email: String!, $role: String!){
    addUser(name: $name, email: $email, role: $role)
  }
`


export const CHANGEPASSWORD = gql`
  mutation ChangePassword($id: ID!,$password: String!){
    changePassword(id: $id,password: $password)
  }
`
