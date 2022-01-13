const docs = require("../dist/index")

describe("Fetch", () => {
  test("Fetch All", (done) => {
    docs.fetchAll()
      .then(() => done())
      .catch(done)
  })
})