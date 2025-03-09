import { ApolloClient , InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri : "http://localhost:3001/",
    cache : new InMemoryCache(),
    headers: {
        "Content-Type": "application/json",
    },
})

export default client;