import * as typing from "./typing"
import * as docs from "./docs"

export function removeXMLTags(str: string): string {
  return str.replace(/<\/?.+?>/g, "")
}

export function breadcrumb(e: typing.SearchResult, separator = "."): string {
  if (!e) return ""
  else if (!e.parent) return e.name
  return parents(e)
    .reverse()
    .filter((e, i) => e && (i === 0 || /^[a-z]/.test(e.name)))
    .map((e) => e?.name)
    .join(separator)
}

export function shortBreadcrumb(e: typing.SearchResult): string {
  if (!e) return ""
  const parent = realParent(e)
  return parent ? `${parent.name}.${e.name}` : e.name
}

export function realParent(e: typing.SearchResult): typing.SearchResult {
  return (
    parents(e).find(
      (parent) => parent && parent !== e && /^[A-Z]/.test(parent.name)
    ) ?? null
  )
}

export function parents(e: typing.SearchResult): typing.SearchResult[] {
  if (!e) return []
  else return e.parent ? [e, ...parents(e.parent)] : [e]
}

export function flatTypeDescription(t: undefined | null): null
export function flatTypeDescription(t: typing.TypeDescription): string
export function flatTypeDescription(
  t: typing.TypeDescription | undefined | null
): string | null {
  if (!t) return null
  if (Array.isArray(t)) return flatTypeName(t)
  else return flatTypeName(t.types)
}

export function flatTypeName(type: typing.TypeName): string {
  return type
    .map((t) => (typeof t === "string" ? t : t.flat(2).join("")))
    .join(" | ")
    .replace(/\*/g, "any")
    .replace(/\bfunction\b/g, "Function")
}

export function buildURL(
  sourceName: typing.SourceName,
  e: typing.SearchResult
): string | null {
  if (e && "meta" in e && e.meta)
    return (
      docs.sources[sourceName]
        .replace("https://raw.githubusercontent.com/", "https://github.com/")
        .replace(/docs\/(.+)\.json$/, "blob/$1/") +
      `${e.meta.path}/${e.meta.file}#L${e.meta.line}`
    )
  return null
}
