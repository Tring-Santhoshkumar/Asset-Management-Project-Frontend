import { gql } from "@apollo/client";

export const GETALLASSETS = gql`
    query getAllAssets {
        allAssets {
            id
            type
            name
            serial_no
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
        serial_no
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
      serial_no
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


export const ADDASSET = gql`
  mutation AddAsset($type: String!, $serial_no: String!, $name: String!, $version: String!, $specifications: String!, $condition: String!,$assigned_to: ID, $assigned_status: String!,
                    $assigned_date: String,$return_date: String){
    addAsset(type: $type, serial_no: $serial_no, name: $name, version: $version, specifications: $specifications, condition: $condition,assigned_to: $assigned_to, assigned_status: $assigned_status, assigned_date: $assigned_date, return_date: $return_date)
  }
`