---
title: Webpack modules & patching
description: Information about the core of moonlight's mod system
sidebar:
  order: 6
---

[Webpack](https://webpack.js.org) is a library used by Discord to turn their codebase into a bundled JavaScript file. Code gets converted into Webpack "modules", which are individual functions that can require and load each other. You can think of them as individual files, each with their own code and exports, but converted into single functions inside of the client.

## Patching

Patching is the process of altering the code of Webpack modules. Each module is [minified](https://en.wikipedia.org/wiki/Minification_(programming)), which means that its source has no whitespace and variable names are often short. Patching allows extensions to find and replace snippets of minified code.

To create a patch, export them from your extension's web entrypoint:

```ts
import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "...",
    replace: {
      match: "...",
      replacement: "..."
    }
  }
];
```

A patch consists of three parts:

- `find` dictates what Webpack module we want to patch. It is matched against the code of all Webpack modules, and once the match is found, it patches that module. Because of this, the match must be specific to a single module.
- `match` is used to find the piece of code we want to patch inside of the target Webpack module. The area of code that is matched is replaced with the `replacement`.
- `replacement` is the code that replaces the matched code.

`find` and `match` can both be regular expressions, and `replacement` can either be a string or a function that returns a string.

You can also set the `type` field in `replace` to `PatchReplaceType.Module`, in which case the `replacement` will be used as the entire module's code. This completely overrides it, breaking other extensions that patch the same module, so use it wisely.

When `match` is a regex and `replacement` is a function, it will be passed the groups matched in the regex. This is useful for capturing and reusing the minified variable names.

Inside of patches, you have access to `module`, `exports`, and `require`. You can use the Webpack require function to load [your own Webpack modules](#webpack-module-insertion).

### Examples

#### Using a regex for a match

```ts
// From Disable Sentry
export const patches: Patch[] = [
  {
    find: "window.DiscordErrors=",
    replace: {
      type: PatchReplaceType.Normal,
      match: /uses_client_mods:\(0,.\..\)\(\)/,
      replacement: "uses_client_mods:false"
    }
  }
];
```

#### Using a function as a replacement

```ts
// From Settings
export const patches: Patch[] = [
  {
    find: 'navId:"user-settings-cog",',
    replace: {
      match: /children:\[(.)\.map\(.+?\),{children:.\((.)\)/,
      // `orig` is the entire string, and the following args are each group
      replacement: (orig, sections, section) =>
        `${orig}??${sections}.find(x=>x.section==${section})?._moonlight_submenu?.()`
    }
  }
];
```

#### Replacing an entire module

```ts
// From Disable Sentry
export const patches: Patch[] = [
  {
    find: "window.DiscordSentry=",
    replace: {
      type: PatchReplaceType.Module,
      replacement: () => () => {
        // no-op
      }
    }
  }
];
```

## Webpack module insertion

Similar to patching, extensions can also insert their own Webpack modules. These can be required like normal modules (which means they can be used inside of patches and other extensions).

To create a Webpack module, export them from your extension's web entrypoint, or [use an ESM Webpack module](/ext-dev/esm-webpack-modules):

```ts
export const webpackModules: Record<string, ExtensionWebpackModule> = {
  moduleName: {
    entrypoint: true,
    run: (module, exports, require) => {
      console.log("Hello, world!");

      // You can export your own data from a Webpack module for use in other places.
      module.exports = "Hello from someLibrary's exports!";
    }
  }
};
```

Specify `entrypoint` to run on startup. If you need to run after a certain Webpack module, or use another module as a library, specify `dependencies`:

```ts
export const webpackModules: Record<string, ExtensionWebpackModule> = {
  moduleName: {
    dependencies: [
      { ext: "common", id: "stores" }
    ],
    entrypoint: true,
    run: (module, exports, require) => {
      const UserStore = require("common_stores").UserStore;
    }
  }
};
```

You can then require this module using the format `${ext.id}_${webpackModule.name}` (e.g. the `stores` Webpack module in the `common` extension has the ID `common_stores`).
