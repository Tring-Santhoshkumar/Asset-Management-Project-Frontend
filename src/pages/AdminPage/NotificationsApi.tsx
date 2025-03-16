import { gql } from "@apollo/client";

export const GETNOTIFICATIONS = gql`
    query GetNotifications{
        getNotifications{
            id
            message
            is_read
            created_at
        }
    }
`

export const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($user_id: ID!, $asset_id: ID!, $message: String!) {
    createNotification(user_id: $user_id, asset_id: $asset_id, message: $message) {
      id
      message
      is_read
      created_at
    }
  }
`;

export const READNOTIFICATIONS = gql`
    mutation ReadNotifications($id: ID!,$choice: Boolean!){
        readNotifications(id: $id,choice: $choice)
    }
`