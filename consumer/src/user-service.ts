import { ApolloClient } from "apollo-boost"
import { InMemoryCache } from "apollo-cache-inmemory"
import gql from "graphql-tag"
import { createHttpLink } from "apollo-link-http"

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    fetch: require("node-fetch"),
    headers: {
      foo: "bar"
    },
    uri: "http://localhost:4100/graphql"
  })
})

export const queryUser = async () => {
  return await client.query<{
    name: string
    age: number
  }>({
    query: gql`
      query User {
        name
        age
      }
    `,
    variables: {
      foo: "bar"
    }
  })
}
