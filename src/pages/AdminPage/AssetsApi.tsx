import { gql } from "@apollo/client";

export const GETALLASSETS = gql`
    query getAllAssets {
        allAssets {
            type
            name
            condition
            assigned_status
            assigned_to{
                name
            }
        }
    }
`