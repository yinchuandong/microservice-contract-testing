import { ApolloClient } from "apollo-boost"
import { InMemoryCache } from "apollo-cache-inmemory"
import gql from "graphql-tag"
import { createHttpLink } from "apollo-link-http"
import axios from "axios"

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    fetch: require("node-fetch"),
    headers: {
      foo: "bar"
    },
    uri: "http://localhost:4100/graphql"
  })
})

const restClient = axios.create({ baseURL: "http://localhost:4100" })

export type UserType = {
  name: string
  age: number
}

export const queryUser = async () => {
  return await apolloClient.query<UserType>({
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

export const getUsers = async () => {
  return await restClient.get<UserType[]>("/rest/users")
}
