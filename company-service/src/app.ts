import * as express from "express"
import { graphqlHTTP } from "express-graphql"
import { buildSchema } from "graphql"

const schema = buildSchema(`
  type Query {
    name: String
    address: String
  }
`)

const root = {
  name: () => "PredictiveHire Pty Ltd",
  address: () => "Melbourne, VIC, Australia"
}

export const app = express()

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    rootValue: root,
    schema
  })
)

export const start = () => {
  // tslint:disable:no-console
  app.listen(4101, () => console.log("Now browse to localhost:4101/graphql"))
}
