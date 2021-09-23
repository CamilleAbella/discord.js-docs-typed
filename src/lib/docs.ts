import fetch from "node-fetch"

import * as typing from "./typing"
import * as check from "./check"
import * as util from "./util"

export const sources = {
  stable:
    "https://raw.githubusercontent.com/discordjs/discord.js/docs/stable.json",
  main: "https://raw.githubusercontent.com/discordjs/discord.js/docs/main.json",
  commando:
    "https://raw.githubusercontent.com/discordjs/commando/docs/master.json",
  rpc: "https://raw.githubusercontent.com/discordjs/rpc/docs/master.json",
  akairo:
    "https://raw.githubusercontent.com/discord-akairo/discord-akairo/docs/master.json",
  collection:
    "https://raw.githubusercontent.com/discordjs/collection/docs/master.json",
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
    const data: typing.Raw = await fetch(sources[sourceName]).then((res) =>
      res.json()
    )
    cache.set(sourceName, data)
    return data
  } catch (err) {
    throw new Error(`Invalid source name or URL "${sourceName}".`)
  }
}
