# Pitfalls

There are some important pitfalls you may encounter when writing moonlight extensions.

## Web vs Node.js

Because of the Electron process model, extensions have two entrypoints: one on the web side (where the actual Discord app runs) and one on the Node.js side (where DiscordNative and such live).

Native Node.js modules *can* be used in an extension, but they cannot be imported from the web side. Instead, write a wrapper around them in your Node.js entrypoint, and call them from the web side:

```ts title="node.ts"
module.exports.doSomething = () => {
  console.log("Doing something...");
};
```

```ts title="index.ts"
const natives = moonlight.getNatives("your extension ID");
natives.doSomething();
```

## Webpack require is not Node.js require

The `require` function used in Webpack modules and patches is not the same as the function in Node.js. Instead, it lets you require other Webpack modules.

If you have a Webpack module you want to load, you can `require` it by its ID. Extension Webpack modules take the form of `${ext.id}_${webpackModule.name}` (e.g. `spacepack_spacepack` or `common_react`).

## Spacepack findByCode matching itself

When using the `findByCode` function in Spacepack while inside of a Webpack module, you can sometimes accidentally match yourself. This can be solved in two ways.

The first option is to bring it out of the Webpack module source, but still in code:

```ts
const findReact = [
  "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED",
  /\.?version(?:=|:)/,
  /\.?createElement(?:=|:)/
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  myWebpackModule: {
    dependencies: [{ ext: "spacepack", id: "spacepack" }],
    run: (module, exports, require) => {
      const spacepack = require("spacepack_spacepack");
      const React = spacepack.findByCode(...findReact)[0].exports;
    }
  }
};
```

The second option is to split a string in half and concatenante it, such that the string is fragmented in source but will evaluate to the same string:

```ts
const spacepack = require("spacepack_spacepack");
const React = spacepack.findByCode([
  "__SECRET_INTERNALS_DO_NOT" + "_USE_OR_YOU_WILL_BE_FIRED",
  /\.?version(?:=|:)/,
  /\.?createElement(?:=|:)/
])[0].exports;
```

## Using JSX

[JSX](https://react.dev/learn/writing-markup-with-jsx) (and its TypeScript version, TSX) is an extension of JavaScript that allows you to write HTML-like syntax in your code. The default configuration of the sample extension is to convert the JSX to `React.createElement` calls:

```tsx
const myElement = <span>Hi!</span>;
// becomes
const myElement = React.createElement("span", null, "Hi!");
```

Because of this, you need to make sure the React variable is in scope. `react` is automatically populated as a Webpack module name with [mappings](/docs/02-ext-dev/07-mappings.md):

```tsx
const React = require("react");
const myElement = <span>Hi!</span>;
```
