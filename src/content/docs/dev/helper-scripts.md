---
title: Helper scripts
sidebar:
  order: 3
---

Inside the moonlight repository, there is a `scripts` folder with some tools in it.

## update.js

Updates the dependency with the given name in all packages.

```shell title="Updating mappings"
node ./scripts/update.js @moonlight-mod/mappings
```

## link.js

Links associated packages with pnpm temporarily. **Not recommended, may break your node_modules.**

```shell title="Using and undoing link"
node ./scripts/link.js
node ./scripts/link.js --undo
```
