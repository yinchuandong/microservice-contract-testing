import * as express from "express"
import { graphqlHTTP } from "express-graphql"
import { buildSchema } from "graphql"

const schema = buildSchema(`
  type Query {
    name: String
    age: Int
  }
`)

const root = {
  name: () => "Johnny",
  age: () => 20
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
  app.listen(4100, () => console.log("Now browse to localhost:4100/graphql"))
}
