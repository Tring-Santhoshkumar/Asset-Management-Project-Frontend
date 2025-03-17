import { ApolloClient, ApolloLink, from, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const authLink = setContext(async (data, { headers }) => {
    let accessToken = localStorage.getItem("token");
    return {
        headers: {
            ...headers,
            Authorization: accessToken ? `Bearer ${accessToken.toString()}` : "",
        }
    }
})

const httpLink = new HttpLink({
    uri: "http://localhost:3001"
})

const client = new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache()
})

export default client;