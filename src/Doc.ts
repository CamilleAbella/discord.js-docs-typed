import * as t from "./TypedContent"

import Fuse from "fuse.js"
import fetch from "node-fetch"

import DocBase from "./DocBase"
import DocClass from "./DocClass"
import DocTypedef from "./DocTypedef"
import DocInterface from "./DocInterface"
import DocElement from "./DocElement"

const docCache = new Map()

const DJS = "discordjs"
const AKAIRO = "discord-akairo"

function dissectURL(url: string) {
  const parts = url.slice(34).split("/")
  return [parts[0], parts[1], parts[3].slice(0, -5)]
}

export default class Doc extends DocBase {
  public fuse: Fuse<any, any>
  public project: string
  public branch: string
  public repo: string

  constructor(public url: string, docs: t.Docs) {
    super(docs)
    ;[this.project, this.repo, this.branch] = dissectURL(url)

    this.adoptAll(docs.classes, DocClass)
    this.adoptAll(docs.typedefs, DocTypedef)
    this.adoptAll(docs.interfaces, DocInterface)

    this.fuse = new Fuse(this.toFuseFormat(), {
      shouldSort: true,
      threshold: 0.5,
      location: 0,
      distance: 80,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ["name", "id"],
      id: "id",
    })
  }

  get repoURL(): string {
    return `https://github.com/${this.project}/${this.repo}/blob/${this.branch}`
  }

  get baseURL(): string | null {
    switch (this.project) {
      case DJS:
        return "https://discord.js.org"
      case AKAIRO:
        return "https://discord-akairo.github.io"
      default:
        return null
    }
  }

  get baseDocsURL(): string | null {
    if (!this.baseURL) return null
    const repo = ["discord.js", AKAIRO].includes(this.repo) ? "main" : this.repo
    return `${this.baseURL}/#/docs/${repo}/${this.branch}`
  }

  get icon(): string | null {
    if (!this.baseURL) return null
    return `${this.baseURL}/favicon.ico`
  }

  get color(): number | null {
    switch (this.project) {
      case DJS:
        return 0x2296f3
      case AKAIRO:
        return 0x87202f
      default:
        return null
    }
  }

  get(...terms: string[]) {
    const exclude = Array.isArray(terms[0]) ? terms.shift() : []
    terms = terms.filter((term) => term).map((term) => term.toLowerCase())

    let elem = this.findChild(terms.shift() as string)
    if (!elem || !terms.length) return elem || null

    while (terms.length) {
      const term = terms.shift()
      const child: DocElement | undefined = elem?.findChild(term, exclude)

      if (!child) return null
      elem = terms.length && child.typeElement ? child.typeElement : child
    }

    return elem ?? null
  }

  search(
    query: string,
    { excludePrivateElements }: { excludePrivateElements?: boolean } = {}
  ): DocElement[] | null {
    const result = this.fuse.search(query)
    if (!result.length) return null

    const filtered: string[] = []

    while (result.length > 0 && filtered.length < 10) {
      const element = this.get(filtered, ...result.shift().split("#"))
      if (excludePrivateElements && element?.access === "private") continue
      filtered.push(element)
    }

    return filtered
  }

  resolveEmbed(query: string, options = {}): t.Embed | null {
    const element = this.get(...query.split(/\.|#/))
    if (element) return element.embed(options)

    const searchResults = this.search(query, options)
    if (!searchResults) return null

    const embed = this.baseEmbed()
    embed.title = "Search results:"
    embed.description = searchResults
      .map((el) => {
        const prefix = el.embedPrefix
        return `${prefix ? `${prefix} ` : ""}**${el.link}**`
      })
      .join("\n")
    return embed
  }

  toFuseFormat() {
    const parents = Array.from(this.children.values())

    const children: any[] = parents
      .map((parent) => Array.from(parent.children.values()))
      .reduce((a, b) => a.concat(b))

    const formattedParents = parents.map(({ name }) => ({ id: name, name }))
    const formattedChildren = children.map(({ name, parent }) => ({
      id: `${parent.name}#${name}`,
      name,
    }))

    return formattedParents.concat(formattedChildren)
  }

  toJSON(): t.Docs {
    return {
      classes: this.classes?.map((item) => item.toJSON()),
      typedefs: this.typedefs?.map((item) => item.toJSON()),
      interfaces: this.interfaces?.map((item) => item.toJSON()),
    }
  }

  baseEmbed(): t.Embed {
    const title =
      {
        "discord.js": "Discord.js Docs",
        commando: "Commando Docs",
        rpc: "RPC Docs",
        "discord-akairo": "Akairo Docs",
        collection: "Collection",
      }[this.repo] || this.repo

    return {
      color: this.color,
      author: {
        name: `${title} (${this.branch})`,
        url: this.baseDocsURL,
        icon_url: this.icon,
      },
    }
  }

  formatType(types: string[]) {
    const typeString = types
      .map((text, index) => {
        if (/<|>|\*/.test(text)) {
          return text
            .split("")
            .map((char) => `\\${char}`)
            .join("")
        }

        const typeElem = this.findChild(text.toLowerCase())
        const prependOr =
          index !== 0 && /\w|>/.test(types[index - 1]) && /\w/.test(text)

        return (prependOr ? "|" : "") + (typeElem ? typeElem.link : text)
      })
      .join("")

    return `**${typeString}**`
  }

  static getRepoURL(id: string) {
    const [name, branch] = id.split("/")
    const project = {
      main: "discord.js",
      commando: "Commando",
      rpc: "RPC",
    }[name]

    return `https://github.com/discordjs/${project}/blob/${branch}/`
  }

  static sources() {
    return t.sources
  }

  static async fetch(
    sourceName: keyof typeof t.sources,
    { force }: { force?: boolean } = {}
  ) {
    const url = t.sources[sourceName] || sourceName
    if (!force && docCache.has(url)) return docCache.get(url)

    try {
      const data = await fetch(url).then((res) => res.json())
      const doc = new Doc(url, data)
      docCache.set(url, doc)
      return doc
    } catch (err) {
      throw new Error("invalid source name or URL.")
    }
  }
}
