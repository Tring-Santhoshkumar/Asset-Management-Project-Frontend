import {gql} from '@apollo/client'

export const REGISTERUSER = gql`
     mutation register($name : String!, $email : String!, $password : String!, $role : String!){
        register(name: $name, email: $email, password: $password, role : $role){
            id
            name
            email
            role
    }
  }
`



