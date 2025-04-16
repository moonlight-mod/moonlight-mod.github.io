---
title: Pitfalls
description: There are some important pitfalls you may encounter when writing moonlight extensions.
sidebar:
  order: 9
---

## Web vs Node.js

Node.js code cannot be imported directly from the web environment. To share code between the two environments, use `moonlight.getNatives`. See [the cookbook](/ext-dev/cookbook#extension-entrypoints) for more information.

## Webpack require is not Node.js require

The `require` function used in Webpack modules and patches is not the same as the function in Node.js. Instead, it's specific to Webpack, and only works inside of Webpack modules. See [here](/ext-dev/webpack#importing-other-webpack-modules) for more information.

## The web entrypoint is not a Webpack module

You cannot use Webpack modules inside of `index.ts`, because it is loaded before Webpack is initialized. Instead, [create your own Webpack module](/ext-dev/webpack#webpack-module-insertion) and use that instead.

## Webpack modules only load when required

By default, Webpack modules will not load unless they are required by another module or the `entrypoint` flag is set. If you need a module to run as soon as possible, [set the entrypoint flag](/ext-dev/webpack#webpack-module-insertion).

## Using ESM features

ESM-specific features (like top-level `await`) are not supported in Webpack modules or the Node or Host environments. The `index.ts` file in your extension (and *only* that file) can be compiled to ESM by [modifying your build script](https://github.com/moonlight-mod/esbuild-config/blob/8e91f1db1773380bc140c9ca3e140c30ecf5bcc3/src/factory.ts#L75).

## Spacepack findByCode matching itself

When using the `findByCode` function in Spacepack while inside of a Webpack module, you can sometimes accidentally match yourself. It is suggested to fragment the string in source but have it evaluate to the same string:

```ts
const { something } = spacepack.findByCode(`__SECRET_INTERNALS_DO_NOT${""}_USE_OR_YOU_WILL_BE_FIRED`)[0].exports;
```

Note that esbuild will merge string concatenation, so you must be creative!

## Using JSX

[JSX](https://react.dev/learn/writing-markup-with-jsx) (and its TypeScript version, TSX) is an extension of JavaScript that allows you to write HTML-like syntax in your code. [Webpack modules](/ext-dev/webpack#webpack-module-insertion) with a `.tsx` filename can use JSX directly. The default configuration of the build script is to convert the JSX to `React.createElement` calls:

```tsx
const myElement = <span>Hi!</span>;
// becomes
const myElement = React.createElement("span", null, "Hi!");
```

Because of this, you need to make sure the React variable is in scope. `react` is automatically populated as a Webpack module name with [mappings](/ext-dev/mappings):

```tsx
import React from "@moonlight-mod/wp/react";
const myElement = <span>Hi!</span>;
```

More information on using React in extensions can be found [here](/ext-dev/cookbook#using-react). Remember to add React to [your module dependencies](/ext-dev/webpack#webpack-module-insertion).

## Using the wrong moonlight global

What moonlight global exists depends on the entrypoint. See [the API documentation](/ext-dev/api) for more details.

## Each Webpack module is an entrypoint

Say you were writing a Webpack module that shared some state:

```ts title="someModule.ts"
export const someState = 1;
```

and you wanted to use it in another Webpack module. Do not directly import the Webpack module as a file:

```ts title="someOtherModule.ts"
import { someState } from "./someModule";
```

as it will make a copy of the module, duplicating your state and causing issues. Each Webpack module is treated as its own entrypoint, and all imports will be duplicated between them. Instead, require it at runtime:

```ts title="otherWebpackModule.ts"
import { someState } from "@moonlight-mod/wp/yourExtension_someModule";
// or
const { someState } = require("yourExtension_someModule");
```

Remember to [type your module](/ext-dev/webpack#importing-other-webpack-modules) when using import statements.

## Restarting dev mode is required in some scenarios

You must restart the `pnpm run dev` command if you make changes to certain files:

- Adding a new extension
- Editing an extension manifest
- Adding/removing a [Webpack module](/ext-dev/webpack#webpack-module-insertion) or [entrypoint](/ext-dev/cookbook#extension-entrypoints)

If you delete anything, it is suggested to run `pnpm run clean` so that they don't stick around in the `dist` folder.
