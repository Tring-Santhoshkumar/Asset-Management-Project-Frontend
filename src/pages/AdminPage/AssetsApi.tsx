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
          assigned_to
          assigned_status
          assigned_date
          return_date
          deleted_at
        } 
    }
`


export const GETASSETBYID = gql`
    query getAssetById($id: ID!){
      asset(id: $id){
        id
        name
        type
        version
        serial_no
        specifications
        condition
        assigned_to
        assigned_status
        assigned_date
        return_date
        deleted_at
      }
    }
`



export const ASSIGNASSET = gql`
  mutation AssignAsset($id: ID!, $assigned_to: ID!){
    assignAsset(id: $id, assigned_to: $assigned_to){
      id
      name
      type
      serial_no
      assigned_to
      assigned_status
      assigned_date
      deleted_at
    }
  }
`;


export const REQUESTASSET = gql`
  mutation RequestAsset($id: ID!){
    requestAsset(id: $id)
  }
`


export const ADDASSET = gql`
  mutation AddAsset($input: addAssetInput){
    addAsset(input: $input)
  }
`


export const GETASSETBYUSERID = gql`
  query GetAssetByUserId($assigned_to: ID!){
      assetByUserId(assigned_to: $assigned_to){
        id
        name
        type
        version
        serial_no
        specifications
        condition
        assigned_to
        assigned_status
        assigned_date
        return_date
        deleted_at
      }
    }
`


export const DELETEASSET = gql`
  mutation DeleteAsset($id: ID!){
    deleteAsset(id: $id)
  }
`