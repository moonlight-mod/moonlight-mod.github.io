---
title: Webpack modules & patching
description: Information about the core of moonlight's mod system
sidebar:
  order: 6
---

[Webpack](https://webpack.js.org) is a library used by Discord to turn their codebase into a bundled JavaScript file. Code gets converted into Webpack "modules", which are individual functions that can require and load each other. You can think of them as individual files, each with their own code and exports, but converted into single functions inside of the client. Each module is [minified](https://en.wikipedia.org/wiki/Minification_(programming)), which means that its source has no whitespace and variable names are often short.

moonlight functions off of text-based matching with strings or regexes against the minified source code of the Webpack modules. This is much faster than looking through every Webpack module's exports, and offers a lot of flexibility to find modules simply by looking for patterns that represent the code itself.

Extensions can combine patching existing Webpack modules, inserting their own Webpack modules, and using existing Webpack modules together to offer a lot of flexibility and power. Almost anything in the client can be modified, reused, or extended.

## Patching

Patching is the process of altering the code of Webpack modules. It allows extensions to find and replace snippets of minified code. You can use patches to change behavior in existing Webpack modules.

To create a patch, export them from your extension's web entrypoint:

```ts
import { Patch } from "@moonlight-mod/types";

export const patches: ExtensionWebExports["patches"] = [
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

`find` and `match` can both be regular expressions. `find` can also be the name of a [mapped module](/ext-dev/mappings). `replacement` can either be a string or a function that returns a string. When `replacement` is a function, the first argument will be the matched string, and the subsequent arguments will be the matched groups (if any).

If you have multiple patches targeting the same module, `replace` can be an array. By default, it will try to apply all patches in the array. If you want to only apply the patches if every patch succeeds, set `hardFail` to true.

You can also set the `type` field in `replace` to `PatchReplaceType.Module`, in which case the `replacement` will be used as the entire module's code. This completely overrides it, breaking other extensions that patch the same module, so use it wisely.

When `match` is a regex and `replacement` is a function, it will be passed the groups matched in the regex. This is useful for capturing and reusing the minified variable names. You can use `\i` as a shorthand to match minified variable names.

Inside of patches, you have access to `module`, `exports`, and `require`. You can use the Webpack require function to load [your own Webpack modules](#webpack-module-insertion).

### Examples

:::caution
These patches may be outdated. Use them as an example for how the API works, and do not take the `find`/`match`/`replacement` verbatim.
:::

#### Using a regex for a match

```ts
// From Disable Sentry
export const patches: ExtensionWebExports["patches"] = [
  {
    find: "window.DiscordErrors=",
    replace: {
      match: /uses_client_mods:\(0,.\..\)\(\)/,
      replacement: "uses_client_mods:false"
    }
  }
];
```

#### Using a function as a replacement

```ts
// From Settings
export const patches: ExtensionWebExports["patches"] = [
  {
    find: 'navId:"user-settings-cog",',
    replace: {
      match: /children:\[(.)\.map\(.+?\),{children:.\((.)\)/,
      replacement: (orig, sections, section) =>
        `${orig}??${sections}.find(x=>x.section==${section})?._moonlight_submenu?.()`
    }
  }
];
```

#### Replacing an entire module

```ts
// From Disable Sentry
export const patches: ExtensionWebExports["patches"] = [
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

### Writing good patches

It is suggested to follow some guidelines when writing patches:

- Never hardcode minified variable names. Use `\i` (or `.`/`.{1,2}` if you prefer), so the patch still functions when the names change.
- Use capture groups (e.g. `(.)`) to use previous variable names and snippets of code in your patches.
- Keep logic inside of the patch to a minimum, and instead use `require` to [load your own Webpack module](#webpack-module-insertion).

### Patching with ASTs

moonlight features experimental AST-based patching through the [LunAST](https://github.com/moonlight-mod/lunast) library.

You can register a patcher from the `moonlight.lunast` global in your extension's `index.ts`. See the LunAST README for more information, or see [here](/blog/moonlight-api-v2#lunast-ast-based-mapping-and-patching) for an example patch.

:::caution
AST-based patching is very experimental. AST-based patching is much slower than regex-based patching, and it may break other patches or Webpack module finds.
:::

## Webpack module insertion

Similar to patching, extensions can also insert their own Webpack modules. These can be required like normal modules (which means they can be used inside of patches and other extensions). Extension Webpack modules take the form of `${ext.id}_${webpackModule.name}` (e.g. the `stores` Webpack module in the `common` extension has the ID `common_stores`).

Webpack modules can be created in the `webpackModules` folder of your extension:

- `./src/<your extension>/webpackModules/<webpack module name>.ts`
- `./src/<your extension>/webpackModules/<webpack module name>/index.ts`

Define the module in `index.ts`, and [restart the dev server](/ext-dev/pitfalls#restarting-dev-mode-is-required-in-some-scenarios):

```ts
export const webpackModules: ExtensionWebExports["webpackModules"] = {
  someModule: {
    // Add dependencies/entrypoint if you need to.
  }
};
```

You can also specify the Webpack module as a function, if you don't like ESM Webpack modules:

```ts
export const webpackModules: ExtensionWebExports["webpackModules"] = {
  someModule: {
    run: (module, exports, require) => {
      // Do whatever!
    }
  }
};
```

Specify `entrypoint` to run on startup. If you need to run after a certain Webpack module, or use another module as a library, specify `dependencies`:

```ts
export const webpackModules: ExtensionWebExports["webpackModules"] = {
  moduleName: {
    dependencies: [
      { ext: "common", id: "stores" },
      { id: "discord/Dispatcher" }
    ],
    entrypoint: true
  }
};
```

If you want types for `import` statements, you can automatically generate them based off of the exports with a declaration file:

```ts title="env.d.ts"
declare module "@moonlight-mod/wp/sampleExtension_someLibrary" {
  export * from "sampleExtension/webpackModules/someLibrary";
}
```

:::info
When using `export default` or `export something` in a ESM Webpack module, you will need to do `require().default` or `require().something` to access it. You can also use `module.exports` from inside of the Webpack module, but it is not recommended.
:::

### Webpack module dependencies

As seen above, extension Webpack modules must specify their dependencies. They will not be inserted until these dependencies have been loaded.

You can specify:

- Extension IDs and Webpack module names (e.g. `{ ext: "common", id: "stores" }`)
  - Use this if you're using [an extension library](/ext-dev/api).
  - Make sure to [mark the extension as a dependency](/ext-dev/cookbook#using-another-extension-as-a-library) in your extension manifest.
- Webpack module names (e.g. `{ id: "discord/Dispatcher" }`)
  - Use this if you're using [mappings](/ext-dev/mappings).
- Strings and regexes to match against other modules
  - Use this if you're using [Spacepack](/ext-dev/helpful-exts#spacepack) to find modules dynamically.

:::caution
Never hardcode a numeric Webpack module ID, as they will change.
:::

### Importing other Webpack modules

Extensions and [the mappings repository](/ext-dev/mappings) offer many Webpack modules to use as libraries in your code.

You can import other Webpack modules by prefixing the ID with `@moonlight-mod/wp`:

```ts
import AppPanels from "@moonlight-mod/wp/appPanels_appPanels";
AppPanels.addPanel(...);
```

Custom extensions and libraries need to be typed with a `declare module` in a `.d.ts`:

```ts
declare module "@moonlight-mod/wp/yourExtension_someModule" {
  export const something: () => void;
}
```

If you need to `require` a module, you should specify the type as the Webpack require:

```ts
import type { WebpackRequireType } from "@moonlight-mod/types";
const webpackRequire = require as unknown as WebpackRequireType;
const AppPanels = require("appPanels_appPanels").default;
```

### Importing Discord's Webpack modules

Sometimes, you need to import a module that isn't mapped yet. You can use [Spacepack](/ext-dev/helpful-exts#spacepack) to find a module yourself. The most common API is `spacepack.findByCode` to find a module based on a unique string in its source code. You can combine this with other functions (like `spacepack.findObjectByKey` and friends) to make your way through the exports if you need.

After locating a module, you can access its exports and use it like normal. Common uses of exports include using React components, calling functions, accessing Flux stores, and more.

Remember to [add the module as a dependency](#webpack-module-dependencies), which will wait to load your Webpack module until the find is matched. The module must be loaded when you attempt to look for it using `findByCode`!
