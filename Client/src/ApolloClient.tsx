import { InMemoryCache } from "@apollo/client";
import { ApolloClient, createHttpLink } from "@apollo/client";

const httpLink = createHttpLink({
  // uri: "http://localhost:4002/graphql",
  uri:"https://video-streamer-iuxd.onrender.com/graphql",
  credentials: "include",
});

export const client = new ApolloClient({
    link: httpLink,
  cache: new InMemoryCache(),
});