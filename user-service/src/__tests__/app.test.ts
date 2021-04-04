import { Verifier } from "@pact-foundation/pact"
import { versionFromGitTag } from "@pact-foundation/absolute-version"
import { app } from "../app"
import { Server } from "node:http"

describe("App Contract Test", () => {
  let server: Server
  beforeAll((done) => {
    server = app.listen(4100)
    done()
  })

  afterAll((done) => {
    server.close()
    done()
  })

  it("should return true", async () => {
    const opts = {
      // Local pacts
      pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
      pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
      pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,
      provider: "UserService",
      providerBaseUrl: "http://localhost:4100/graphql",
      // Your version numbers need to be unique for every different version of your provider
      // see https://docs.pact.io/getting_started/versioning_in_the_pact_broker/ for details.
      // If you use git tags, then you can use @pact-foundation/absolute-version as we do here.
      providerVersion: versionFromGitTag(),
      // this should be set to true only when CI=true
      publishVerificationResult: process.env.CI === "true" ? true : false,
      consumerVersionTags: ["master"]
    }

    try {
      await new Verifier(opts).verifyProvider()
    } catch (error) {
      expect(error).toBeUndefined()
    }
  })
})
