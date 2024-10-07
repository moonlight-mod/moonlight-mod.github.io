---
title: ESM Webpack modules
description: Instead of embedding a Webpack module as a function in your extension, you can create a separate file that gets loaded by moonlight.
sidebar:
  order: 4
---

Instead of embedding a Webpack module as a function in your extension, you can create a separate file that gets loaded by moonlight.

To use it, simply create a `./src/<your extension>/webpackModules/<webpack module name>.ts`. You can then `require("<your extension>_<webpack module name>")`.

## Importing inside of Webpack modules

You can import other Webpack modules by prefixing it with `@moonlight-mod/wp`:

```ts
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
const something = spacepack.findByCode(...);
```

Custom extensions and libraries need to be typed with a `declare module` in a `.d.ts`:

```ts
declare module "@moonlight-mod/wp/sampleExtension_someLibrary" {
  export const something: string;
}
```

## CJS and ESM interop

When using `export default` or `export something` in a ESM Webpack module like this, you will need to do `require("ext_id").default` or `require("ext_id").something` to access it. You can also use `module.exports`, but there may be issues that arise from it.

Importing the default export of a mapped Webpack module may have issues.
