import * as docs from "./docs"

export type SourceName = keyof typeof docs.sources

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

export interface Class {
  parent: SearchResult
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

export interface Interface {
  parent: SearchResult
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
  parent: SearchResult
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
  parent: SearchResult
  name: string
  description?: string
  see?: string[]
  meta: Meta
}

export interface Prop {
  parent: SearchResult
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
  parent: SearchResult
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
  parent: SearchResult
  name: string
  description?: string
  see?: string[]
  deprecated?: true
  params?: Param[]
  meta?: Meta
}

export interface Param {
  parent: SearchResult
  name: string
  description?: string
  optional?: true
  default?: any
  variable?: true
  nullable?: true
  type: TypeDescription
}

export interface Meta {
  line: number
  file: string
  path: string
}

export interface Construct {
  name: string
  description?: string
  see?: string[]
  access?: Access
  params?: Param[]
}
