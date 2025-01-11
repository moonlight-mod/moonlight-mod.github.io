---
title: Cookbook
description: Common patterns when writing extensions
sidebar:
  order: 3
---

## Exporting from your extension

On the web target (`index.ts`), you can export patches, Webpack modules, and styles:

```ts
import type { ExtensionWebExports } from "@moonlight-mod/types";

export const patches: ExtensionWebExports["patches"] = [];
export const webpackModules: ExtensionWebExports["webpackModules"] = {};
export const styles: ExtensionWebExports["styles"] = [];
```

All exports are optional.

## Extension entrypoints

Extensions can load in three different environments:

- In the browser (the "web" environment where Discord lives): `index.ts` & Webpack modules
- On the Node.js side, where DiscordNative and such live: `node.ts`
- On the host, with little sandboxing and access to Electron APIs: `host.ts`

These map to the renderer, preload script, and main process in Electron terminology. The term "browser" is used to refer to the moonlight browser extension, while "web" refers to both the desktop and browser platforms.

Most extensions only need to run code in the browser. Use the Node environment if you need access to system APIs, like the filesystem or creating processes. Use the Host environment if you need to use the Electron API.

Remember that [you cannot directly import Node.js modules](/ext-dev/pitfalls#web-vs-nodejs), and should [share code with `moonlight.getNatives`](#sharing-code-between-nodejs-and-the-web).

## Sharing code between Node.js and the web

Make a `node.ts` file:

```ts title="node.ts"
module.exports.doSomething = () => {
  console.log("Doing something...");
};
```

Then, use it from your extension:

```ts title="index.ts"
const natives = moonlight.getNatives("your extension ID");
// natives will be null if using moonlight in the browser
natives?.doSomething();
```

Remember to [restart the dev server](/ext-dev/pitfalls#restarting-dev-mode-is-required-in-some-scenarios).

## Using another extension as a library

Mark the extension as a dependency of your extension:

```json title="manifest.json"
{
  "dependencies": ["markdown"]
}
```

Mark the Webpack module as a dependency of your own Webpack module:

```ts title="index.ts"
export const webpackModules: ExtensionWebExports["webpackModules"] = {
  someModule: {
    dependencies: [
      {
        ext: "markdown",
        id: "markdown"
      }
    ]
  }
};
```

Then, import the Webpack module:

```ts title="webpackModules/someModule.ts"
import * as markdown from "@moonlight-mod/wp/markdown_markdown";

markdown.addRule(/* ... */);
```

Remember to [restart the dev server](/ext-dev/pitfalls#restarting-dev-mode-is-required-in-some-scenarios).

## Making a custom React component

Mark React as a dependency of your own Webpack module:

```ts title="index.ts"
export const webpackModules: ExtensionWebExports["webpackModules"] = {
  element: {
    dependencies: [
      {
        id: "react"
      }
    ]
  }
};
```

Then, import React from [mappings](/ext-dev/mappings):

```tsx title="webpackModules/element.tsx"
import React from "@moonlight-mod/wp/react";

export default function MyElement() {
  return <span>Hello, world!</span>;
}
```

React [must be imported when using JSX](/ext-dev/pitfalls#using-jsx).

## Using Spacepack to find code dynamically

```ts
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
const { something } = spacepack.findByCode(/* ... */)[0].exports;
```

Remember to add your find to [your extension dependencies](/ext-dev/webpack#webpack-module-insertion) and [declare Spacepack as a dependency](#using-another-extension-as-a-library).

## Interacting with Flux events

```ts
import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";

// Listen for MESSAGE_CREATE events
Dispatcher.subscribe("MESSAGE_CREATE", (event: any) => {
  console.log(event);
});

// Block all events (don't actually do this)
Dispatcher.addInterceptor((event) => {
  console.log(event.type);
  return true;
});
```

## Interacting with Flux stores

```ts
import { UserStore } from "@moonlight-mod/wp/common_stores";

console.log(UserStore.getCurrentUser());
```
