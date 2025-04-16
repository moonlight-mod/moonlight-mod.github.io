---
title: Cookbook
description: Common patterns when writing extensions
sidebar:
  order: 3
---

## Extension entrypoints

Some extensions need to go beyond the scope of the Discord web application and interact with the native parts of the client. To help with this, extensions can load in one or more environments:

- The "web" environment (the browser where the web app runs): `index.ts` & Webpack modules
- The "Node" environment (where DiscordNative runs, with access to Node.js APIs): `node.ts`
- The "host" environment (with little sandboxing and access to Electron APIs): `host.ts`

These map to the renderer, preload script, and main process in Electron terminology. In moonlight internals, the term "browser" is used to refer to the moonlight browser extension, while "web" refers to the web application that runs on the desktop app and browser site.

Most extensions only run in the web environment, where the majority of the Discord client code executes in. However, extensions can run in the other environments for access to extra APIs when needed. Use system APIs as little as possible, and be mindful about [security concerns](https://www.electronjs.org/docs/latest/tutorial/context-isolation#security-considerations).

Extensions can export APIs from the Node environment and import them from the web environment using `moonlight.getNatives`:

```ts title="node.ts"
export function doSomething() {
  // insert some Node.js-specific code here
}
```

```ts title="webpackModules/something.ts"
const natives = moonlight.getNatives("your extension ID");
natives.doSomething();
```

Remember to [restart the dev server](/ext-dev/pitfalls#restarting-dev-mode-is-required-in-some-scenarios) after creating `node.ts`, and that [you cannot directly import node.ts](/ext-dev/pitfalls#web-vs-nodejs).

## Exporting from your extension

On the web target (`index.ts`), you can export [patches](/ext-dev/webpack#patching), [Webpack modules](/ext-dev/webpack#webpack-module-insertion), and CSS styles:

```ts
import type { ExtensionWebExports } from "@moonlight-mod/types";

export const patches: ExtensionWebExports["patches"] = [];
export const webpackModules: ExtensionWebExports["webpackModules"] = {};
export const styles: ExtensionWebExports["styles"] = [];
```

All exports are optional. If you aren't exporting anything from this file (e.g. your extension works entirely on the Node or host environments), you can delete `index.ts`.

## Using React

Create a [Webpack module](/ext-dev/webpack#webpack-module-insertion) with a `.tsx` file extension, then mark React as a [module dependency](/ext-dev/webpack#webpack-module-dependencies):

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

In the module, import React from [mappings](/ext-dev/mappings):

```tsx title="webpackModules/element.tsx"
import React from "@moonlight-mod/wp/react";

export default function MyElement() {
  return <span>Hello, world!</span>;
}
```

You can use this React component in a [patch](/ext-dev/webpack#patching) or through an [extension library](/ext-dev/api#app-panels). React must be imported into the scope [when using JSX](/ext-dev/pitfalls#using-jsx).

## Using Flux

Discord internally maintains a heavily-modified fork of [Flux](https://github.com/facebookarchive/flux). Various state and events in the client are managed with Flux.

### Interacting with Flux events

Flux events contain a type (e.g. `MESSAGE_CREATE`) and their associated data. They function similarly to [the Discord gateway](https://discord.com/developers/docs/events/gateway) (and some gateway events have Flux equivalents), but they are two separate concepts, and there are client-specific Flux events.

To interact with Flux events, mark `discord/Dispatcher` as a [module dependency](/ext-dev/webpack#webpack-module-dependencies), then import it from [mappings](/ext-dev/mappings) in your Webpack module:

```ts
import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";

// Listen for MESSAGE_CREATE events
Dispatcher.subscribe("MESSAGE_CREATE", (event: any) => {
  console.log(event);
});

// Block all events (don't actually do this)
Dispatcher.addInterceptor((event) => {
  console.log(event.type);
  return true; // return `true` to block, `false` to pass through
});
```

### Interacting with Flux stores

Flux stores contain application state and dispatch/receive events. Most Flux stores use the same central Flux dispatcher (`discord/Dispatcher`).

To interact with Flux stores, use the [Common](/ext-dev/api#common) extension library by adding it as a dependency to your [extension](/ext-dev/manifest#dependencies) and [module](/ext-dev/webpack#webpack-module-dependencies):

```ts
import { UserStore } from "@moonlight-mod/wp/common_stores";

console.log(UserStore.getCurrentUser());
```

Flux stores can be used in React components with [the `useStateFromStores` hook](https://github.com/moonlight-mod/mappings/blob/main/src/mappings/discord/packages/flux/useStateFromStores.ts).

## Using slash commands

Slash commands can be registered with the [Commands](/ext-dev/api#commands) extension library. Remember to add the Commands extension as a [extension](/ext-dev/manifest#dependencies) and [module](/ext-dev/webpack#webpack-module-dependencies) dependency.

```ts
import Commands from "@moonlight-mod/wp/commands_commands";
import { InputType, CommandType } from "@moonlight-mod/types/coreExtensions/commands";

Commands.registerCommand({
  id: "myCoolCommand",
  description: "(insert witty example description here)",
  inputType: InputType.BUILT_IN,
  type: CommandType.CHAT,
  options: [],
  execute: () => {
    // do something here
  }
});
```

### Modifying message content before it is sent

The legacy command system can also be used to replace text in messages before they are sent.

```ts
import Commands from "@moonlight-mod/wp/commands_commands";

Commands.registerLegacyCommand("unique-id", {
  // This can be a more specific regex, but this only tells it to run if it
  // finds anything that matches this regex within the message.
  // You will have to do your own extraction and processing if you want to do
  // something based on a specific string.
  match: /.*/,
  action: (content, context) => {
    // modify the content here
    return { content };
  }
})
```
