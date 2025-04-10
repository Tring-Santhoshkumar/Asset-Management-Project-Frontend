import { gql } from "@apollo/client";

export const GETALLASSETS = gql`
    query getAllAssets {
        allAssets {
          id
          name
          type
          version
          serial_no
          specifications
          condition
          assignedTo{
            name 
            email
          }
          assigned_status
          assigned_date
          return_date
          deleted_at
        } 
    }
`

export const GETALLASSETSPAGINATION = gql`
  query GetAllAssetsPagination($page: Int!, $limit: Int!, $assigned_status: AssignedStatus){
    getAllAssetsPagination(page: $page, limit: $limit, assigned_status: $assigned_status){
        assets{
          id
          name
          type
          version
          serial_no
          specifications
          condition
          assignedTo{
            id
          }
          assigned_status
          assigned_date
          return_date
          deleted_at
        }
          totalCount
  }
  }
`


export const GETASSETBYID = gql`
    query getAssetById($id: String!){
      asset(id: $id){
        id
        name
        type
        version
        serial_no
        specifications
        condition
        assignedTo{
            name
            email
        }
        assigned_status
        assigned_date
        return_date
        deleted_at
      }
    }
`



export const ASSIGNASSET = gql`
  mutation AssignAsset($id: String!, $assigned_to: String!){
    assignAsset(id: $id, assigned_to: $assigned_to){
      id
      name
      type
      serial_no
      assignedTo{
        id
      }
      assigned_status
      assigned_date
      deleted_at
    }
  }
`;


export const REQUESTASSET = gql`
  mutation RequestAsset($id: String!){
    requestAsset(id: $id)
  }
`


export const ADDASSET = gql`
  mutation AddAsset($input: addAssetInput!){
    addAsset(input: $input)
  }
`


export const GETASSETBYUSERID = gql`
  query GetAssetByUserId($assigned_to: String!){
      assetByUserId(assigned_to: $assigned_to){
        id
        name
        type
        version
        serial_no
        specifications
        condition
        assignedTo{
          id
        }
        assigned_status
        assigned_date
        return_date
        deleted_at
      }
    }
`


export const DELETEASSET = gql`
  mutation DeleteAsset($id: String!){
    deleteAsset(id: $id)
  }
`
