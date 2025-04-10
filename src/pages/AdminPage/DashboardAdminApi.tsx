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


export const LATESTUPDATEDUSER = gql`
    query LatestUpdatedUser{
        latestUpdatedUser{
            latest{
                name
                email
            }
            oldest{
                name
                email
            }
        }
    }
`
