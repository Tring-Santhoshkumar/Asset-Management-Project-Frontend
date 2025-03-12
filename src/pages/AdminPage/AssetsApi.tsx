import { gql } from "@apollo/client";

export const GETALLASSETS = gql`
    query getAllAssets {
        allAssets {
            id
            type
            name
            version
            condition
            assigned_status
            assigned_to
        }
    }
`


export const GETASSETBYID = gql`
    query getAssetById($id: ID!){
      asset(id: $id){
        name
        type
        version
        specifications
        condition
        assigned_to
        assigned_status
        assigned_date
        return_date
      }
    }
`



export const ASSIGNASSET = gql`
  mutation AssignAsset($id: ID!, $assigned_to: ID!){
    assignAsset(id: $id, assigned_to: $assigned_to){
      id
      name
      type
      assigned_to
      assigned_status
      assigned_date
    }
  }
`;


export const REQUESTASSET = gql`
  mutation RequestAsset($id: ID!){
    requestAsset(id: $id)
  }
`