/* tslint:disable:no-unused-expression object-literal-sort-keys max-classes-per-file no-empty */
import * as path from "path"
import { getUsers, queryUser } from "../user-service"
import { Pact, GraphQLInteraction, Interaction, Matchers } from "@pact-foundation/pact"
const { like } = Matchers

describe("UserService", () => {
  let provider: Pact
  beforeAll(async (done) => {
    provider = new Pact({
      port: 4100,
      log: path.resolve(process.cwd(), "logs", "UserService.log"),
      dir: path.resolve(process.cwd(), "pacts"),
      consumer: "WebConsumer",
      provider: "UserService"
    })
    await provider.setup()
    done()
  })

  afterAll(async (done) => {
    await provider.finalize()
    done()
  })

  describe("GraphQL/queryUser", () => {
    beforeAll(async (done) => {
      /**
       * NOTE: I feel this query should be generated automatically from an Swagger openapi file or some other schema files with example data.
       */
      const graphqlQuery = new GraphQLInteraction()
        .uponReceiving("a query User")
        .withQuery(
          `
          query User {
            name
            age
          }
        `
        )
        .withOperation("User")
        .withRequest({
          path: "/graphql",
          method: "POST"
        })
        .withVariables({
          foo: "bar"
        })
        .willRespondWith({
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: {
            data: {
              name: like("Johnny"),
              age: like(20)
            }
          }
        })
      await provider.addInteraction(graphqlQuery)
      done()
    })

    // verify with Pact, and reset expectations
    afterEach(async (done) => {
      await provider.verify()
      done()
    })

    it("should return the correct user response", async () => {
      const result = await queryUser()
      return expect(result.data).toEqual({
        name: "Johnny",
        age: 20
      })
    })
  })

  describe("rest/getUsers", () => {
    beforeAll(async (done) => {
      const getUsersInteracton = new Interaction()
        .uponReceiving("REST getUser")
        .withRequest({
          method: "GET",
          path: "/rest/users"
        })
        .willRespondWith({
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: [
            {
              name: like("Molly"),
              age: like(24)
            }
          ]
        })

      await provider.addInteraction(getUsersInteracton)
      done()
    })

    afterEach(async (done) => {
      await provider.verify()
      done()
    })

    it("should return the correct get users response", async () => {
      const result = await getUsers()
      return expect(result.data).toEqual([
        {
          name: "Molly",
          age: 24
        }
      ])
    })
  })
})
