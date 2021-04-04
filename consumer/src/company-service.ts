import { ApolloClient } from "apollo-boost"
import { InMemoryCache } from "apollo-cache-inmemory"
import gql from "graphql-tag"
import { createHttpLink } from "apollo-link-http"

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    fetch: require("node-fetch"),
    uri: "http://localhost:4101/graphql"
  })
})

export const queryCompany = async () => {
  return await client.query<{
    name: string
    address: string
  }>({
    query: gql`
      query Company {
        name
        address
      }
    `
  })
}
