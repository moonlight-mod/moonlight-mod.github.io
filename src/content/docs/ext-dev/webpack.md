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

To create a patch, [export them from your extension's web entrypoint](/ext-dev/cookbook#exporting-from-your-extension):

```ts title="index.ts"
import type { ExtensionWebExports } from "@moonlight-mod/types";

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

:::caution
Keep in mind that finds or replacements may break on Discord updates. See [here](/ext-dev/mappings#mappings-stability) for more information.
:::

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

- Never hardcode minified variable names. Use `\i` (or `.`/`.{1,2}` if you prefer), so the patch still functions when the names change. `\i` is automatically resolved to escape identifiers by the moonlight patching system.
- Use capture groups (e.g. `(\i)`) to use previous variable names and snippets of code in your patches.
- Keep logic inside of the patch to a minimum, and instead use `require` to [load your own Webpack module](#webpack-module-insertion).

### Patching with ASTs

moonlight features experimental AST-based patching through the [LunAST](https://github.com/moonlight-mod/lunast) library.

You can register a patcher from the `moonlight.lunast` global in your extension's `index.ts`. See the LunAST README for more information, or see [here](/blog/moonlight-api-v2#lunast-ast-based-mapping-and-patching) for an example patch.

:::caution
AST-based patching is very experimental. AST-based patching is much slower than regex-based patching, and it may break other patches or Webpack module finds.
:::

## Webpack module insertion

Similar to patching, extensions can also insert their own Webpack modules. Extension logic is defined in Webpack modules, which are loaded from other Webpack modules (from other extensions or from patches). Extension module IDs take the form of `${ext.id}_${webpackModule.name}` (e.g. the `stores` Webpack module in the `common` extension has the ID `common_stores`).

To create a Webpack module, make a new file in the `webpackModules` folder of your extension:

- `./src/<your extension>/webpackModules/<webpack module name>.ts`
- `./src/<your extension>/webpackModules/<webpack module name>/index.ts`

Define the Webpack module [in your extension's exports](/ext-dev/cookbook#exporting-from-your-extension):

```ts title="index.ts"
export const webpackModules: ExtensionWebExports["webpackModules"] = {
  someModule: {
    // Add dependencies/entrypoint if you need to (see below)
  }
};
```

:::note
When adding or removing a new Webpack module, remember to [restart the dev server](/ext-dev/pitfalls#restarting-dev-mode-is-required-in-some-scenarios).
:::

By default, Webpack modules only load when imported/required by another Webpack module. If you want your Webpack module to load immediately on startup, set `entrypoint: true` in the module config.

Alternatively, instead of using a separate file for your modules, you may specify a function for your module in the `run` field. We encourage using separate files for each Webpack module when possible.

:::caution
Webpack modules should only be imported inside other Webpack modules or in [DevTools](/ext-dev/devtools). Do not import Webpack modules from your extension's `index.ts`, as it will fail.
:::

:::caution
Webpack modules are fully synchronous. Top-level await is not supported in Webpack modules.
:::

### Webpack module dependencies

If a Webpack module requires another module that hasn't been loaded yet, the import will fail, and the client may crash. To solve this issue, extension Webpack modules must specify the other modules they depend on. The module will not be inserted into the Webpack runtime until all of the dependencies have been loaded.

```ts title="index.ts"
export const webpackModules: ExtensionWebExports["webpackModules"] = {
  someModule: {
    dependencies: [
      { ext: "markdown", id: "markdown" }
    ]
  }
};
```

In the `dependencies` array, you can specify:

- Extension IDs and Webpack module names (e.g. `{ ext: "common", id: "stores" }`)
  - Use this if you're using [an extension library](/ext-dev/api).
  - Make sure to mark the extension as [a dependency in your extension manifest](/ext-dev/manifest#dependencies).
- Webpack module names (e.g. `{ id: "discord/Dispatcher" }`)
  - Use this if you're using [mappings](/ext-dev/mappings).
- Strings and regexes to match against other modules
  - Use this if you're using [Spacepack](/ext-dev/api#spacepack) to [find modules dynamically](#importing-discords-webpack-modules).

:::caution
Never hardcode a numeric Webpack module ID, as they will change.
:::

### Using your Webpack module

Your Webpack module can export data that can be accessed from inside patches and other Webpack modules:

```ts title="webpackModules/someModule.ts"
export function doSomething() {
  // insert actual non-demonstration code here
}
```

```ts
// In a patch
require("sampleExtension_someModule").doSomething();
// Using Spacepack
spacepack.require("sampleExtension_someModule").doSomething();
// In another Webpack module
import { doSomething } from "@moonlight-mod/wp/sampleExtension_someModule";
```

When importing your Webpack module from another Webpack module, make sure you have [marked it as a dependency](#webpack-module-dependencies).

When using `import` on your own Webpack module, you can automatically generate the export types with a declaration file:

```ts title="env.d.ts"
declare module "@moonlight-mod/wp/sampleExtension_someLibrary" {
  export * from "sampleExtension/webpackModules/someLibrary";
}
```

:::note
When using `export default` in a Webpack module, and when importing the module with `require`, you must access the default export via `require().default`.
:::

:::caution
Exports can also be assigned with the `module.exports` object, but it is discouraged.
:::

### Importing other Webpack modules

moonlight features many built-in [extension libraries](/ext-dev/api) to use in your own Webpack modules.

You can import other Webpack modules by prefixing the ID with `@moonlight-mod/wp`:

```ts
import AppPanels from "@moonlight-mod/wp/appPanels_appPanels";
AppPanels.addPanel(...);
```

:::caution
Remember to mark the [extension](/ext-dev/manifest#dependencies) and [module](#webpack-module-dependencies) as a dependency when using them in your code.
:::

:::caution
Be careful to not directly import the source file instead of importing the Webpack module with the `@moonlight-mod/wp` prefix. See [here](/ext-dev/pitfalls#each-webpack-module-is-an-entrypoint) for more information.
:::

Custom extensions and libraries that aren't built into moonlight need to be typed with a `declare module` in a `.d.ts`:

```ts
declare module "@moonlight-mod/wp/yourExtension_someModule" {
  export const doSomething: () => void;
}
```

If you need to `require` a module instead of using import statements, you should specify the type of the require function:

```ts
import type { WebpackRequireType } from "@moonlight-mod/types";
const webpackRequire = require as unknown as WebpackRequireType;
const AppPanels = require("appPanels_appPanels").default;
```

:::caution
The `@moonlight-mod/wp` prefix is a special declaration for `import` statements. Do not include the prefix when using the module ID elsewhere (e.g. `require`).
:::

### Importing Discord's Webpack modules

:::note
Some of Discord's Webpack modules are available under unique names with [the mappings system](/ext-dev/mappings). We encourage you to use the mappings system when possible.
:::

Sometimes, you need to import a module that isn't mapped yet. To accomplish this, you can use [Spacepack](/ext-dev/api#spacepack) to find a module yourself. Remember to add Spacepack as a dependency to your [extension](/ext-dev/manifest#dependencies) and [module](#webpack-module-dependencies).

The most common API is `spacepack.findByCode`, which find module(s) based on a unique string in its source code:

```ts
const moduleExports = spacepack.findByCode(/* finds to look for */)[0].exports;
```

Pass finds as arguments to this function. These finds function similarly to [patching](#patching), so it can accept strings and regexes.

You can combine the results with other functions (like `spacepack.findObjectByKey` and friends) to make your way through a module's exports if necessary. Most code will access the first result in the array (`[0]`) and then use the module's exports (`.exports`). After locating a module, you can access its exports and use it like normal. Common uses of exports include using React components, calling functions, accessing Flux stores, and more.

:::caution
Remember to [add the module you require as a dependency](#webpack-module-dependencies), which will wait to load your Webpack module until the find is matched. The module must be loaded when you attempt to look for it using `findByCode`!
:::

## Discord module stability

Discord modules do not have any API stability guarantees. The Discord client may update randomly and break your extension. Because of this, maintaining extensions requires more effort than other software modding communities, as keeping your extension working may require (ir)regular updates.

Module finds may change from the source of the module changing, which can break patches and Webpack module finds. Webpack module exports may also change, breaking runtime usage of Webpack modules.

To minimize the chance of your extension breaking, you can do the following:

- Structure your code with the expectation that various systems may randomly fail.
- Use [mappings](/ext-dev/mappings) and [extension libraries](/ext-dev/api/#extension-libraries) as much as possible, which moves the maintenance burden to moonlight itself.
- Null check potentially fragile exports and use [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining).
- Use the [ErrorBoundary](/ext-dev/api#common) component provided by moonlight to safely catch errors in your UI code.
- Reimplement trivial logic (e.g. a simple UI component) in your extension, instead of depending on a Webpack module.
- [Write good patches](/ext-dev/webpack#writing-good-patches).

Historically, Discord has had several major tooling updates that heavily impacted all client mods (e.g. switching to SWC and Rspack). Other minor bundler updates have caused issues for moonlight in the past (e.g. what we called the ["Components Crisis"](/blog/component-cartography/)). Major breaking changes is somewhat rare, but minor breaking patches or modules happens frequently (e.g. a few times per month).
