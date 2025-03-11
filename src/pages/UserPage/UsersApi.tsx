import { gql } from "@apollo/client";

export const GETUSER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      dob
      gender
      blood_group
      marital_status
      phone
      address
      profile_pic
      designation
      department
      city
      state
      pin_code
      country
    }
  }
`;




export const UPDATEUSER = gql`
    mutation UpdateUser($id : ID!, $name : String!, $email : String!, $dob : String!, $gender : String!, $blood_group : String!,
    $marital_status : String!, $phone : String!, $address : String!, $designation : String!, $department : String!,
    $city : String!, $state : String!, $pin_code : String!, $country : String!, $profile_pic : String){
        updateUser(id : $id, name : $name, email : $email, dob : $dob, gender : $gender, blood_group : $blood_group,
        marital_status : $marital_status, phone : $phone, address : $address, designation : $designation,department : $department, 
        city : $city, state : $state, pin_code : $pin_code, country : $country, profile_pic : $profile_pic){
            id,
            name,
            email,
            dob,
            gender,
            blood_group,
            marital_status,
            phone,
            address,
            designation,
            department,
            city,
            state,
            pin_code,
            country,
            profile_pic
    }
  }
`