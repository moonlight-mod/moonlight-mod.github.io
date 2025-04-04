---
title: Helper scripts
sidebar:
  order: 3
---

Inside the moonlight repository, there is a `scripts` folder with some tools in it.

## link.mjs

Links associated packages with pnpm temporarily. **Not recommended, may break your node_modules.**

```shell title="Using and undoing link"
node ./scripts/link.mjs
node ./scripts/link.mjs --undo
```
