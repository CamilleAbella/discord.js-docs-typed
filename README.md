# Discord.js Docs

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

<hr>

## docs.fetchRaw(sourceName[, options])

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

## docs.search(raw, path)

Gets documentation for one element. Multiple properties/methods can be chained by `.` in the "path" param.
**Params**:

| name |  type  |  required  |
| :--: | :----: | :--------: | --- |
| raw  |  Raw   | SourceName | yes |
| path | string |    yes     |

**Returns**: `Promise<SearchResult>`

```ts
// from raw
const someCLass = await docs.search(stable, "message")
const someMethod = await docs.search(stable, "message.guild.iconURL")

// from sourceName
const someProp = await docs.search("stable", "message.guild.name")
const someParam = await docs.search(
  "stable",
  "message.guild.members.fetch.options"
)
```

## docs.fetchAll(options)

Fetch all the documentations and stock it in the `docs.cache` Map object. (returns this one)

**Params**:

|  name   |  type  | required |
| :-----: | :----: | :------: |
| options | object |    no    |

**Returns**: `Promise<Map<SourceName, Raw>>`

```ts
const cache = await docs.fetchAll()
cache.forEach((raw, sourceName) => {
  console.log(sourceName, raw.meta)
})
```

## docs.flatTypeDescription(type)

Get the flat version of a 3D array type description

**Params**:

| name |      type       | required |
| :--: | :-------------: | :------: |
| type | TypeDescription |    no    |

**Returns**: `string | null`

```ts
const stable = await docs.fetchRaw("stable")
const someProp = await docs.search(stable, "client.ws")

if (docs.isProp(stable, someProp))
  console.log(docs.flatTypeDescription(someProp.type))
```

## docs.buildURL(sourceName, result)

Get the doc source URL in the Github repository

**Params**:

|    name    |     type     | required |
| :--------: | :----------: | :------: |
| sourceName |  SourceName  |   yes    |
|   result   | SearchResult |   yes    |

**Returns**: `string | null`

```ts
const someProp = await docs.search("stable", "guild.owner.user.id")

console.log(docs.buildURL("stable", someProp))
```

## docs.isXXXX(raw, result)

Type assertion method

**Params**:

|  name  |     type     | required |
| :----: | :----------: | :------: |
|  raw   |     Raw      |   yes    |
| result | SearchResult |   yes    |

**Returns**: `result is XXXX` (`boolean`)
