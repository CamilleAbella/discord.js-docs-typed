import * as typing from "./typing"

export const isClass = (
  raw: typing.Raw,
  e: typing.SearchResult
): e is typing.Class => !!(e && raw.classes?.includes(e as any))
export const isTypedef = (
  raw: typing.Raw,
  e: typing.SearchResult
): e is typing.Typedef => !!(e && raw.typedefs?.includes(e as any))
export const isExternal = (
  raw: typing.Raw,
  e: typing.SearchResult
): e is typing.External => !!(e && raw.externals?.includes(e as any))
export const isInterface = (
  raw: typing.Raw,
  e: typing.SearchResult
): e is typing.Interface => !!(e && raw.interfaces?.includes(e as any))

export const isProp = (
  raw: typing.Raw,
  e: typing.SearchResult
): e is typing.Prop =>
  !!(
    e &&
    (raw.classes?.some((c) => c.props?.includes(e as any)) ||
      raw.typedefs?.some((t) => t.props?.includes(e as any)) ||
      raw.interfaces?.some((i) => i.props?.includes(e as any)))
  )

export const isEvent = (
  raw: typing.Raw,
  e: typing.SearchResult
): e is typing.Event =>
  !!(
    e &&
    (raw.classes?.some((c) => c.events?.includes(e as any)) ||
      raw.interfaces?.some((i) => i.events?.includes(e as any)))
  )

export const isMethod = (
  raw: typing.Raw,
  e: typing.SearchResult
): e is typing.Method =>
  !!(
    e &&
    (raw.classes?.some((c) => c.methods?.includes(e as any)) ||
      raw.interfaces?.some((i) => i.methods?.includes(e as any)))
  )

export const isParam = (
  raw: typing.Raw,
  e: typing.SearchResult
): e is typing.Param =>
  !!(
    e &&
    (raw.classes?.some((c) =>
      c.methods?.some((m) => m.params?.includes(e as any))
    ) ||
      raw.interfaces?.some((i) =>
        i.methods?.some((m) => m.params?.includes(e as any))
      ))
  )
