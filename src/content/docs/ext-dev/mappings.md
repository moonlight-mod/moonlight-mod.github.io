---
title: Mappings
description: moonlight uses mappings that automatically rename Webpack modules for you.
sidebar:
  order: 8
---

moonlight uses [mappings](https://github.com/moonlight-mod/mappings) that automatically rename Webpack modules for you.

:::caution
There are currently some issues with import types being wrong with ESM Webpack modules. If an import errors, try importing in a different way:

- `import Thing`
- `import * as Thing`
- `import { Thing }`

:::

## Notable modules

- `react`: React
- `discord/packages/flux`: Discord's fork of Flux
- `discord/Dispatcher`: Discord's Flux dispatcher
- `discord/components/common/index`: A lot of components reused in the client

## Using mappings in an extension

You can import and require mappings like any other module:

```ts
import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";
// or
const Dispatcher = require("discord/Dispatcher").default;
```

Remember to [add the module as a dependency](/ext-dev/webpack#webpack-module-dependencies).
