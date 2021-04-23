import DocClass from "./DocClass"
import DocTypedef from "./DocTypedef"
import DocInterface from "./DocInterface"

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

export enum Types {
  CLASS = "class",
  EVENT = "event",
  INTERFACE = "interface",
  METHOD = "method",
  PARAM = "param",
  PROP = "prop",
  TYPEDEF = "typedef",
}

export interface Docs {
  classes?: DocClass[]
  typedefs?: DocTypedef[]
  interfaces?: DocInterface[]
}
