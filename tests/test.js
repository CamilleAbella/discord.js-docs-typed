const docs = require("../dist/index")

describe("Sources", () => {
  test("Fetch all source", (done) => {
    docs.fetchAll()
      .then(() => done())
      .catch(done)
  })
})

describe("Search", () => {
  test("Search for client", (done) => {
    docs.search("discord.js/main", "client")
      .then(() => done())
      .catch(done)
  })
})

describe("Checks", () => {
  test("isClass", async () => {
    const djs = await docs.fetchRaw("discord.js/main")
    const client = await docs.search(djs, "client")

    expect(docs.isClass(djs, client)).toBe(true)
    expect(docs.isEvent(djs, client)).toBe(false)
    expect(docs.isMethod(djs, client)).toBe(false)
    expect(docs.isProp(djs, client)).toBe(false)
    expect(docs.isParam(djs, client)).toBe(false)
    expect(docs.isExternal(djs, client)).toBe(false)
    expect(docs.isInterface(djs, client)).toBe(false)
    expect(docs.isTypedef(djs, client)).toBe(false)
  })

  test("isEvent", async () => {
    const djs = await docs.fetchRaw("discord.js/main")
    const ready = await docs.search(djs, "client ready")

    expect(docs.isClass(djs, ready)).toBe(false)
    expect(docs.isEvent(djs, ready)).toBe(true)
    expect(docs.isMethod(djs, ready)).toBe(false)
    expect(docs.isProp(djs, ready)).toBe(false)
    expect(docs.isParam(djs, ready)).toBe(false)
    expect(docs.isExternal(djs, ready)).toBe(false)
    expect(docs.isInterface(djs, ready)).toBe(false)
    expect(docs.isTypedef(djs, ready)).toBe(false)
  })

  test("isMethod", async () => {
    const djs = await docs.fetchRaw("discord.js/main")
    const destroy = await docs.search(djs, "client destroy")

    expect(docs.isClass(djs, destroy)).toBe(false)
    expect(docs.isEvent(djs, destroy)).toBe(false)
    expect(docs.isMethod(djs, destroy)).toBe(true)
    expect(docs.isProp(djs, destroy)).toBe(false)
    expect(docs.isParam(djs, destroy)).toBe(false)
    expect(docs.isExternal(djs, destroy)).toBe(false)
    expect(docs.isInterface(djs, destroy)).toBe(false)
    expect(docs.isTypedef(djs, destroy)).toBe(false)
  })

  test("isProp", async () => {
    const djs = await docs.fetchRaw("discord.js/main")
    const channels = await docs.search(djs, "client channels")

    expect(docs.isClass(djs, channels)).toBe(false)
    expect(docs.isEvent(djs, channels)).toBe(false)
    expect(docs.isMethod(djs, channels)).toBe(false)
    expect(docs.isProp(djs, channels)).toBe(true)
    expect(docs.isParam(djs, channels)).toBe(false)
    expect(docs.isExternal(djs, channels)).toBe(false)
    expect(docs.isInterface(djs, channels)).toBe(false)
    expect(docs.isTypedef(djs, channels)).toBe(false)
  })

  test("isParam", async () => {
    const djs = await docs.fetchRaw("discord.js/main")
    const channel = await docs.search(djs, "client login token")

    expect(docs.isClass(djs, channel)).toBe(false)
    expect(docs.isEvent(djs, channel)).toBe(false)
    expect(docs.isMethod(djs, channel)).toBe(false)
    expect(docs.isProp(djs, channel)).toBe(false)
    expect(docs.isParam(djs, channel)).toBe(true)
    expect(docs.isExternal(djs, channel)).toBe(false)
    expect(docs.isInterface(djs, channel)).toBe(false)
    expect(docs.isTypedef(djs, channel)).toBe(false)
  })

  test("isExternal", async () => {
    const djs = await docs.fetchRaw("discord.js/main")
    const channel = await docs.search(djs, "rest")

    expect(docs.isClass(djs, channel)).toBe(false)
    expect(docs.isEvent(djs, channel)).toBe(false)
    expect(docs.isMethod(djs, channel)).toBe(false)
    expect(docs.isProp(djs, channel)).toBe(false)
    expect(docs.isParam(djs, channel)).toBe(false)
    expect(docs.isExternal(djs, channel)).toBe(true)
    expect(docs.isInterface(djs, channel)).toBe(false)
    expect(docs.isTypedef(djs, channel)).toBe(false)
  })

  // test("isInterface", async () => {
  //   const djs = await docs.fetchRaw("builders/main")
  //   const channel = await docs.search(djs, "SlashCommandSubcommandsOnlyBuilder")
  //
  //   expect(docs.isClass(djs, channel)).toBe(false)
  //   expect(docs.isEvent(djs, channel)).toBe(false)
  //   expect(docs.isMethod(djs, channel)).toBe(false)
  //   expect(docs.isProp(djs, channel)).toBe(false)
  //   expect(docs.isParam(djs, channel)).toBe(false)
  //   expect(docs.isExternal(djs, channel)).toBe(false)
  //   expect(docs.isInterface(djs, channel)).toBe(true)
  //   expect(docs.isTypedef(djs, channel)).toBe(false)
  // })

  test("isTypeDef", async () => {
    const djs = await docs.fetchRaw("discord.js/main")
    const channel = await docs.search(djs, "ActionRowData")

    expect(docs.isClass(djs, channel)).toBe(false)
    expect(docs.isEvent(djs, channel)).toBe(false)
    expect(docs.isMethod(djs, channel)).toBe(false)
    expect(docs.isProp(djs, channel)).toBe(false)
    expect(docs.isParam(djs, channel)).toBe(false)
    expect(docs.isExternal(djs, channel)).toBe(false)
    expect(docs.isInterface(djs, channel)).toBe(false)
    expect(docs.isTypedef(djs, channel)).toBe(true)
  })
})