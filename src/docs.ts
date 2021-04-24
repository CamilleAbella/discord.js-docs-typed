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
    "https://raw.githubusercontent.com/discord-akairo/discord-akairo/docs/master.json",
  collection:
    "https://raw.githubusercontent.com/discordjs/collection/docs/master.json",
}

export const cache = new Map<SourceName, Raw>()

export const isClass = (raw: Raw, e: SearchResult): e is Class =>
  !!(e && raw.classes?.includes(e as any))
export const isTypedef = (raw: Raw, e: SearchResult): e is Typedef =>
  !!(e && raw.typedefs?.includes(e as any))
export const isExternal = (raw: Raw, e: SearchResult): e is External =>
  !!(e && raw.externals?.includes(e as any))
export const isInterface = (raw: Raw, e: SearchResult): e is Interface =>
  !!(e && raw.interfaces?.includes(e as any))

export const isProp = (raw: Raw, e: SearchResult): e is Prop =>
  !!(
    e &&
    (raw.classes?.some((c) => c.props?.includes(e as any)) ||
      raw.typedefs?.some((t) => t.props?.includes(e as any)) ||
      raw.interfaces?.some((i) => i.props?.includes(e as any)))
  )

export const isEvent = (raw: Raw, e: SearchResult): e is Event =>
  !!(
    e &&
    (raw.classes?.some((c) => c.events?.includes(e as any)) ||
      raw.interfaces?.some((i) => i.events?.includes(e as any)))
  )

export const isMethod = (raw: Raw, e: SearchResult): e is Method =>
  !!(
    e &&
    (raw.classes?.some((c) => c.methods?.includes(e as any)) ||
      raw.interfaces?.some((i) => i.methods?.includes(e as any)))
  )

export const isParam = (raw: Raw, e: SearchResult): e is Param =>
  !!(
    e &&
    (raw.classes?.some((c) =>
      c.methods?.some((m) => m.params?.includes(e as any))
    ) ||
      raw.interfaces?.some((i) =>
        i.methods?.some((m) => m.params?.includes(e as any))
      ))
  )

export function search(raw: Raw, path: string): SearchResult {
  const segments = path.toLowerCase().split(/\s+|\.|#|\/|\\/)

  let item: SearchResult = null

  for (let index = 0; index < segments.length; index++) {
    const segment = segments[index]

    let items: SearchResult[]

    if (!item) {
      items = [
        ...(raw.interfaces ?? []),
        ...(raw.classes ?? []),
        ...(raw.typedefs ?? []),
        ...(raw.externals ?? []),
      ]
    } else {
      if (isClass(raw, item) || isInterface(raw, item)) {
        items = [
          ...(item.events ?? []),
          ...(item.methods ?? []),
          ...(item.props ?? []),
        ]
      } else if (isTypedef(raw, item)) {
        items = [...(item.param ?? []), ...(item.props ?? [])]
      } else if (isMethod(raw, item) || isEvent(raw, item)) {
        items = item.params ?? []
      } else if (isProp(raw, item)) {
        if (index === segments.length) return item
        else
          return search(
            raw,
            [flatTypeDescription(item.type), ...segments.slice(index)].join(".")
          )
      } else {
        return item
      }
    }

    item =
      items.find((item) => {
        return item?.name.toLowerCase() === segment
      }) ?? null

    if (!item) return null
  }

  return item
}

function flatTypeDescription(t: TypeDescription): string {
  if (Array.isArray(t)) return t.flat(2).join("")
  else return t.types.flat(2).join("")
}

export async function fetchAll({ force }: { force?: boolean } = {}) {
  for (const sourceName in sources) {
    await fetchRaw(sourceName as SourceName, { force })
  }

  return cache
}

export async function fetchRaw(
  sourceName: SourceName,
  { force }: { force?: boolean } = {}
): Promise<Raw> {
  if (!force && cache.has(sourceName)) return cache.get(sourceName) as Raw

  try {
    const data: Raw = await fetch(sources[sourceName]).then((res) => res.json())
    cache.set(sourceName, data)
    return data
  } catch (err) {
    throw new Error("invalid source name or URL.")
  }
}

export function flatType(type: TypeName): string {
  return type.flat(2).join("")
}

export type SourceName = keyof typeof sources

export type TypeName = (string | (string | string[])[])[]
export type TypeDescription =
  | TypeName
  | {
      types: TypeName
      description?: string
    }

export type SearchResult =
  | Prop
  | Method
  | Event
  | Param
  | Interface
  | Class
  | Typedef
  | External
  | null

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
  classes?: Class[]
  interfaces?: Interface[]
  typedefs?: Typedef[]
  externals?: External[]
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
