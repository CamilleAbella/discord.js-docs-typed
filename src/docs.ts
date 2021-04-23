import fetch from "node-fetch"

export const sources = {
  stable:
    "https://raw.githubusercontent.com/discordjs/discord.js/docs/stable.json",
  master:
    "https://raw.githubusercontent.com/discordjs/discord.js/docs/master.json",
  commando:
    "https://raw.githubusercontent.com/discordjs/commando/docs/master.json",
  rpc: "https://raw.githubusercontent.com/discordjs/rpc/docs/master.json",
  akairo:
    "https://raw.githubusercontent.com/discord-akairo/discord-akairo/docs/stable.json",
  "akairo-master":
    "https://raw.githubusercontent.com/discord-akairo/discord-akairo/docs/master.json",
  collection:
    "https://raw.githubusercontent.com/discordjs/collection/docs/master.json",
}

export interface Embed {
  title?: string | null
  description?: string | null
  color?: number | null
  author?: {
    name: string
    icon_url?: string | null
    url?: string | null
  }
}

export enum Type {
  CLASS = "class",
  EVENT = "event",
  INTERFACE = "interface",
  METHOD = "method",
  PARAM = "param",
  PROP = "prop",
  TYPEDEF = "typedef",
}

export const cache = new Map<string, Raw>()

export async function search(raw: Raw) {}

export async function fetchRaw(
  sourceName: keyof typeof sources,
  { force }: { force?: boolean } = {}
): Promise<Raw> {
  const url = sources[sourceName] ?? sourceName

  if (!force && cache.has(url)) return cache.get(url) as Raw

  try {
    const data: Raw = await fetch(url).then((res) => res.json())
    cache.set(url, data)
    return data
  } catch (err) {
    throw new Error("invalid source name or URL.")
  }
}

export function flatType(type: TypeName): string {
  return type.flat(2).join("")
}

export type TypeName = (string | (string | string[])[])[]
export type TypeDescription =
  | TypeName
  | {
      types: TypeName
      description?: string
    }

export type Access = "private" | "protected"

export interface Raw {
  meta: {
    generator: string
    format: number
    date: number
  }
  custom: {
    [name: string]: {
      name: string
      files: {
        [name: string]: {
          name: string
          type: string
          content: string
          path: string
        }
      }
    }
  }
  classes: Class[]
  interfaces: Interface[]
  typedefs: Typedef[]
  externals: External[]
}

export interface Meta {
  line: number
  file: string
  path: string
}

export interface Class {
  name: string
  description?: string
  see?: string[]
  extends?: TypeDescription
  implements?: TypeDescription
  access?: Access
  abstract?: true
  deprecated?: true
  construct?: Construct
  props?: Prop[]
  methods?: Method[]
  events?: Event[]
  meta: Meta
}

export interface Construct {
  name: string
  description?: string
  see?: string[]
  access?: Access
  params?: Param[]
}

export interface Interface {
  name: string
  description?: string
  see?: string[]
  extends?: TypeDescription
  implements?: TypeDescription
  access?: Access
  abstract?: true
  deprecated?: true
  construct?: Construct
  props?: Prop[]
  methods?: Method[]
  events?: Event[]
  meta?: Meta
}

export interface Typedef {
  name: string
  description?: string
  see?: string[]
  access?: Access
  deprecated?: true
  type: TypeDescription
  props?: Prop[]
  param?: Param[]
  returns?: TypeDescription
  returnsDescription?: TypeDescription
  meta: Meta
}

export interface External {
  name: string
  description?: string
  see?: string[]
  meta: Meta
}

export interface Prop {
  name: string
  description?: string
  meta: Meta
  access?: Access
  type: TypeDescription
  nullable?: true
  readonly?: boolean
  deprecated?: true
  default?: any
}

export interface Method {
  name: string
  description?: string
  see?: string[]
  scope?: string
  access?: Access
  inherits?: string
  inherited?: true
  implements?: string
  examples?: string[]
  abstract?: true
  deprecated?: true
  emits?: string[]
  throws?: string[]
  params?: Param[]
  async?: true
  returns?: TypeDescription
  returnsDescription?: string
  meta: Meta
}

export interface Event {
  name: string
  description?: string
  see?: string[]
  deprecated?: true
  params?: Param[]
  meta?: Meta
}

export interface Param {
  name: string
  description?: string
  optional?: true
  default?: any
  variable?: true
  nullable?: true
  type: TypeDescription
}
