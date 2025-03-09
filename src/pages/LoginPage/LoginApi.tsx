import { gql } from "@apollo/client";

export const LOGINUSER = gql`
    mutation login($email : String!,$password : String!){
        login(email : $email,password : $password)
    }
`