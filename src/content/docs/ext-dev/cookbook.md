---
title: Cookbook
description: Common patterns when writing extensions
sidebar:
  order: 10
---

## Exporting styles

```ts title="index.ts"
export const styles: string[] = [
  `.alert {
    color: red;
  }`
];
```

## Using another extension as a library

```ts title="manifest.json"
{
  "dependencies": ["markdown"]
}
```

```ts title="webpackModules/something.ts"
import * as markdown from "@moonlight-mod/wp/markdown_markdown";

markdown.addRule(/* ... */);
```

## Using mappings

In this case, the Flux dispatcher. Import types may be wrong in some scenarios (try `import * as Something` or `import { Something }` if you get errors, and let us know!).

```ts title="index.ts"
export const webpackModules: Record<string, ExtensionWebpackModule> = {
  something: {
    dependencies: [
      {
        id: "discord/Dispatcher"
      }
    ]
  }
};
```

```ts title="webpackModules/something.ts"
import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";

Dispatcher.subscribe("MESSAGE_CREATE", (data) => {
  console.log(data);
});
```

## Custom React component

```ts name="index.ts"
export const webpackModules: Record<string, ExtensionWebpackModule> = {
  element: {
    dependencies: [
      {
        id: "react"
      }
    ]
  }
};
```

```ts name="webpackModules/element.tsx"
import React from "@moonlight-mod/wp/react";

export default function MyElement() {
  return <span>Hello, world!</span>;
}
```
