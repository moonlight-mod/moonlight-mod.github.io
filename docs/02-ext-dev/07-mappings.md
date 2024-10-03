# Mappings

moonlight uses [mappings](https://github.com/moonlight-mod/mappings) that automatically rename Webpack modules for you.

## Using import statements with mappings

For mapped modules with types, you can `import` from them like normal in a Webpack module:

```ts
import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";
```

## Using require with mappings

For mapped modules without types, you will need to require them manually. Your build system might not understand your `require`, so you may need to use `spacepack.require`:

```ts
// React has a type, so this is not required, but this is for demonstration
const React = spacepack.require("react");
```

## Adding a mapped module to dependencies

You can add a mapped module to your Webpack module dependencies like normal - just remove the `ext` field.

```ts
export const webpackModules: Record<string, ExtensionWebpackModule> = {
  something: {
    dependencies: [
      {
        id: "discord/Dispatcher"
      },
      {
        id: "react"
      }
    ]
  }
};
```
