## Discord.js Docs

A parser and wrapper for the [discord.js](https://github.com/discordjs/discord.js) docs.

## Install

```shell
npm i ghom-djs-docs
```

## Import

```ts
// ESModule / TypeScript
import * as docs from "ghom-djs-docs"

// Or CommonJS
const docs = require("ghom-djs-docs")
```

### docs.fetchRaw(sourceName[, options])

Fetches and parses the docs for the given project.\
`sourceName` can be any of the predefined values (`stable`, `master`, `commando`, `rpc`, `akairo`, and `collection`)
or an URL which will return the raw generated docs (e.g https://raw.githubusercontent.com/discordjs/discord.js/docs/master.json ).\
Once a documentation is fetched it will be cached. Use `options.force` to avoid this behavior.

**Params**:

|    name    |    type    | required |
| :--------: | :--------: | :------: |
| sourceName | SourceName |   yes    |
|  options   |   object   |    no    |

**Returns**: `Promise<Raw | null>`

```ts
const master = await docs.fetchRaw("master")
const akairo = await docs.fetchRaw("akairo", { force: true })
```

### docs.search(raw, path)

Gets documentation for one element. Multiple properties/methods can be chained by `.` in the "path" param.
**Params**:

| name |  type  | required |
| :--: | :----: | :------: |
| raw  |  Raw   |   yes    |
| path | string |   yes    |

**Returns**: `SearchResult`

```ts
const someCLass = docs.search(master, "message")
const someMethod = docs.search(master, "message.guild.iconURL")
const someProp = docs.search(master, "message.guild.name")
const someParam = docs.search(master, "message.guild.members.fetch.options")
```

### docs.fetchAll(options)

Fetch all the documentations and stock it in the `docs.cache` Map object. (returns this one)

**Params**:

|  name   |  type  | required |
| :-----: | :----: | :------: |
| options | object |    no    |

**Returns**: `Promise<Map<SourceName, Raw>>`

### docs.isXXXX(raw, result)

Checks and types result

**Params**:

|  name  |     type     | required |
| :----: | :----------: | :------: |
|  raw   |     Raw      |   yes    |
| result | SearchResult |   yes    |

**Returns**: `result is XXXX`
