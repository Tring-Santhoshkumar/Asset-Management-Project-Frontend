import { gql } from "@apollo/client";

export const USERCHART = gql`
    query userChart{
        users{
            role
            status
            gender
        }
    }
`