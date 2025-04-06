import { gql } from "@apollo/client";

export const GETNOTIFICATIONS = gql`
    query GetNotifications($page: Int!,$limit: Int!){
        getNotifications(page: $page,limit: $limit){
            notifications{
              id
              message
              is_read
              approved
              rejected
              created_at
              userId{
                name
                email
              }
              assetId{
                type
                name
                serial_no
              }
              exchangeAssetId{
                type
                name
                serial_no
              }
            }
            totalCount
        }
    }
`

export const GETNOTIFICATIONSICON = gql`
  query GetAllNotificationsIcon{
    getAllNotificationsIcon{
            id
            message
            is_read
            approved
            rejected
            created_at
    }
  }
`

export const GETNOTIFICATIONSBYID = gql`
  query GetNotificationsById($user_id: String!){
    getNotificationsById(user_id: $user_id){
            id
            message
            is_read
            approved
            rejected
            created_at
    }
  }
`

export const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($user_id: String!, $asset_id: String!, $message: String!) {
    createNotification(user_id: $user_id, asset_id: $asset_id, message: $message) {
      id
      message
      is_read
      created_at
      approved
      rejected
    }
  }
`

export const CREATE_EXCHANGE_NOTIFICATION = gql`
  mutation CreateExchangeNotification($user_id: String!, $asset_id: String!, $exchange_asset_id: String!, $message: String!){
    createExchangeNotification(user_id: $user_id, asset_id: $asset_id, exchange_asset_id: $exchange_asset_id, message: $message){
      id
      message
      is_read
      created_at
      approved
      rejected
    }
  }
`



export const READNOTIFICATIONS = gql`
    mutation ReadNotifications($id: String!,$choice: Boolean!){
        readNotifications(id: $id,choice: $choice)
    }
`
