import * as t from "./TypedContent"

import DocElement from "./DocElement"

export default class DocBase {
  public children = new Map<string, DocElement>()

  constructor(public originalJSON: t.Docs) {}

  addChild(child: DocElement) {
    this.children.set(`${child.name.toLowerCase()}-${child.docType}`, child)
  }

  adoptAll(enumerable: DocElement[], Constructor: any) {
    if (!enumerable) return
    for (const elem of enumerable) {
      this.addChild(new Constructor(this, elem))
    }
  }

  childrenOfType(type: t.Types) {
    const filtered = Array.from(this.children.values()).filter(
      (child) => child.docType === type
    )

    return filtered.length ? filtered : null
  }

  findChild(query: string, exclude: DocElement[] = []) {
    query = query.toLowerCase()

    let docType: t.Types | null = null
    if (query.endsWith("()")) {
      query = query.slice(0, -2)
      docType = t.Types.METHOD
    } else if (query.startsWith("e-")) {
      query = query.slice(2)
      docType = t.Types.EVENT
    }

    return Array.from(this.children.values()).find(
      (child) =>
        !exclude.includes(child) &&
        child.name.toLowerCase() === query &&
        (!docType || child.docType === docType)
    )
  }

  get classes() {
    return this.childrenOfType(t.Types.CLASS)
  }

  get typedefs() {
    return this.childrenOfType(t.Types.TYPEDEF)
  }

  get interfaces() {
    return this.childrenOfType(t.Types.INTERFACE)
  }

  get props() {
    return this.childrenOfType(t.Types.PROP)
  }

  get methods() {
    return this.childrenOfType(t.Types.METHOD)
  }

  get events() {
    return this.childrenOfType(t.Types.EVENT)
  }

  get params() {
    return this.childrenOfType(t.Types.PARAM)
  }

  static get types() {
    return t.Types
  }
}

module.exports = DocBase
