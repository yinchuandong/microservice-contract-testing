/* tslint:disable:no-unused-expression object-literal-sort-keys max-classes-per-file no-empty */
import * as path from "path"
import { queryCompany } from "../company-service"
import { Pact, GraphQLInteraction, Matchers } from "@pact-foundation/pact"
const { like } = Matchers

describe("CompanyService", () => {
  let provider: Pact
  beforeAll(async (done) => {
    provider = new Pact({
      port: 4101,
      log: path.resolve(process.cwd(), "logs", "CompanyService.log"),
      dir: path.resolve(process.cwd(), "pacts"),
      consumer: "WebConsumer",
      provider: "CompanyService"
    })
    await provider.setup()
    done()
  })

  afterAll(async (done) => {
    await provider.finalize()
    done()
  })

  describe("query Company", () => {
    beforeAll(async (done) => {
      /**
       * NOTE: I feel this query should be generated automatically from an Swagger openapi file or some other schema files with example data.
       */
      const graphqlQuery = new GraphQLInteraction()
        .uponReceiving("a query compnay")
        .withQuery(
          `
          query Company {
            name
            address
          }
        `
        )
        .withOperation("Company")
        .withRequest({
          path: "/graphql",
          method: "POST"
        })
        .withVariables({})
        .willRespondWith({
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: {
            data: {
              name: like("PredictiveHire Pty Ltd"),
              address: like("Melbourne, VIC, Australia")
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

    it("should return the correct company response", async () => {
      const result = await queryCompany()
      return expect(result.data).toEqual({
        name: "PredictiveHire Pty Ltd",
        address: "Melbourne, VIC, Australia"
      })
    })
  })
})
