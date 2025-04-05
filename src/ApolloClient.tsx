import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_URL,
})

// const tokenExpired = (token: string) => {
//   try {
//     const decoded: any = jwtDecode(token);
//     // console.log("Expiration time :", decoded.exp * 1000, Date.now());
//     return decoded.exp * 1000 < Date.now();
//   } catch (error) {
//     console.error("Error decoding token:", error);  
//   }
// };

const handleLogout = () => {
  localStorage.clear();
  window.location.href = '/';
}

const errorLink = onError(({ graphQLErrors, networkError}) => {
  if(graphQLErrors){
    graphQLErrors.forEach((error) => {
      if(error.message.includes('jwt expired')){
        // console.log('ERROR : ',error);
        handleLogout();
      }
    })
  }
  if (networkError) console.error(`Network error : ${networkError}`);
})


const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token") || '';
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    }
  }
});


const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
})

export default client;