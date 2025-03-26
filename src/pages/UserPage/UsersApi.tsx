import { gql } from "@apollo/client";

export const GETUSER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      dob
      gender
      blood_group
      marital_status
      phone
      address
      designation
      department
      city
      state
      pin_code
      country
      status
    }
  }
`;




export const UPDATEUSER = gql`
mutation UpdateUser($input: updateUserInput) {
  updateUser(input: $input) {
    id
    name
    email
    role
    dob
    gender
    blood_group
    marital_status
    phone
    address
    designation
    department
    city
    state
    pin_code
    country
    status
    created_at
    updated_at
    deleted_at
    reset_password
  }
  }
`


export const DELETEUSER = gql`
  mutation DeleteUser($id: ID!){
    deleteUser(id: $id)
  }
`


export const DEASSIGNASSET = gql`
  mutation DeAssignAsset($id: ID!){
    deAssignAsset(id: $id)
  }
`