import axios from "axios"

import * as typing from "./typing"
import * as check from "./check"
import * as util from "./util"

// todo: fetch github doc version files with https://stackoverflow.com/questions/25022016/get-all-file-names-from-a-github-repo-through-the-github-api
// https://api.github.com/repos/[USER]/[REPO]/git/trees/[BRANCH]?recursive=1

// from (https://raw.githubusercontent.com/discordjs/docs/main/[NAME]/[VERSION].json) !

export const sources = {
  "v11": "https://raw.githubusercontent.com/discordjs/docs/main/discord.js/v11.json",
  "v12": "https://raw.githubusercontent.com/discordjs/docs/main/discord.js/v12.json",
  "v13": "https://raw.githubusercontent.com/discordjs/docs/main/discord.js/v13.json",
  "discord.js/stable":
    "https://raw.githubusercontent.com/discordjs/docs/main/discord.js/stable.json",
  "discord.js/main":
    "https://raw.githubusercontent.com/discordjs/docs/main/discord.js/main.json",
  commando:
    "https://raw.githubusercontent.com/discordjs/docs/main/legacy/commando/master.json",
  rpc: "https://raw.githubusercontent.com/discordjs/docs/main/legacy/rpc/master.json",
  rest: "https://raw.githubusercontent.com/discordjs/docs/main/rest/main.api.json",
  util: "https://raw.githubusercontent.com/discordjs/docs/main/util/main.api.json",
  voice: "https://raw.githubusercontent.com/discordjs/docs/main/voice/main.api.json",
  ws: "https://raw.githubusercontent.com/discordjs/docs/main/ws/main.api.json",
  akairo:
    "https://raw.githubusercontent.com/discord-akairo/discord-akairo/docs/master.json",
  "collection/main":
    "https://raw.githubusercontent.com/discordjs/docs/main/collection/main.json",
  "collection/stable":
    "https://raw.githubusercontent.com/discordjs/docs/main/collection/stable.json",
  "builders/stable":
    "https://raw.githubusercontent.com/discordjs/docs/main/builders/stable.json",
  "builders/main":
    "https://raw.githubusercontent.com/discordjs/docs/main/builders/main.json",
  "brokers": "https://raw.githubusercontent.com/discordjs/docs/main/brokers/main.api.json",
}

export const cache = new Map<typing.SourceName, typing.Raw>()

export async function search(
  raw: typing.Raw | typing.SourceName,
  path: string,
  parent: typing.SearchResult = null
): Promise<typing.SearchResult> {
  if (typeof raw === "string") raw = await fetchRaw(raw)

  const segments = path.toLowerCase().split(/\s+|\.|#|\/|\\/)

  let item: typing.SearchResult = null

  for (let index = 0; index < segments.length; index++) {
    const segment = segments[index]

    let items: typing.SearchResult[]

    if (!item) {
      items = [
        ...(raw.interfaces ?? []),
        ...(raw.classes ?? []),
        ...(raw.typedefs ?? []),
        ...(raw.externals ?? []),
      ]
    } else {
      parent = item
      if (check.isClass(raw, item) || check.isInterface(raw, item)) {
        items = [
          ...(item.events ?? []),
          ...(item.methods ?? []),
          ...(item.props ?? []),
        ]
      } else if (check.isTypedef(raw, item)) {
        items = [...(item.param ?? []), ...(item.props ?? [])]
      } else if (check.isMethod(raw, item) || check.isEvent(raw, item)) {
        items = item.params ?? []
      } else if (check.isProp(raw, item) || check.isParam(raw, item)) {
        if (index === segments.length) return item
        else
          return search(
            raw,
            [
              util.flatTypeDescription(item.type),
              ...segments.slice(index),
            ].join("."),
            parent
          )
      } else {
        item.parent = parent
        return item
      }
    }

    item =
      items.find((item) => {
        return item?.name.toLowerCase() === segment
      }) ?? null

    if (!item) return null
    else item.parent = parent
  }

  return item
}

export async function fetchAll({ force }: { force?: boolean } = {}) {
  for (const sourceName in sources) {
    await fetchRaw(sourceName as typing.SourceName, { force })
  }

  return cache
}

export async function fetchRaw(
  sourceName: typing.SourceName,
  { force }: { force?: boolean } = {}
): Promise<typing.Raw> {
  if (!force && cache.has(sourceName))
    return cache.get(sourceName) as typing.Raw

  try {
    const data: typing.Raw = await axios
      .get(sources[sourceName])
      .then((res) => res.data)
    cache.set(sourceName, data)
    return data
  } catch (err) {
    throw new Error(`Invalid source name or URL "${sourceName}".`)
  }
}
