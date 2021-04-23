import DocElement from "./DocElement"
import DocProp from "./DocProp"
import DocMethod from "./DocMethod"
import DocEvent from "./DocEvent"
import * as t from "./TypedContent"

class DocClass extends DocElement {
  public extends: string | null
  public implements: string | null
  public construct: string

  constructor(doc, data: t.Docs) {
    super(doc, DocElement.types.CLASS, data)
    this.extends = data.extends || null
    this.implements = data.implements || null
    this.construct = data.construct

    this.adoptAll(data.props, DocProp)
    this.adoptAll(data.methods, DocMethod)
    this.adoptAll(data.events, DocEvent)
  }
}

module.exports = DocClass
