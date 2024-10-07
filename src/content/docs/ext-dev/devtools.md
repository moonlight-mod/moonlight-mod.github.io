---
title: Using DevTools
description: The Chrome DevTools is a panel/window that offers several utilities for web development. Normally, it is intended for the creators of the target application, but it also serves as an excellent tool for client modders.
sidebar:
  order: 8
---

The Chrome DevTools is a panel/window that offers several utilities for web development. Normally, it is intended for the creators of the target application, but it also serves as an excellent tool for client modders.

## Enabling DevTools

In some branches of Discord, the following is required in the `settings.json` file (*not* the moonlight config file):

```json
"DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING": true
```

## Reading module sources

See the [helpful extensions](/ext-dev/helpful-exts) page first for `patchAll` and how to use Spacepack.

To see the source of a module, print the function with `spacepack.inspect`:

```js
spacepack.inspect(/* module ID */)
```

The returned value will be a function you can double click to see the module source. The bottom left "Pretty print" button can be used to make the output more readable. It is suggested to disable pretty printing temporarily when writing patches.

You can chain `inspect` with `findByCode` (or an equivalent) when trying to find the source of a patch in a rush:

```js
spacepack.inspect(spacepack.findByCode(/* finds */)[0].id)
```

The pattern `n(/* some number */)` represents a require, and is another module ID inside of the argument. You can pass that module ID to `spacepack.inspect` to read the required module source.

## Using the debugger

You can set breakpoints on Webpack modules to inspect the variables at runtime. Click on the left sidebar to set a breakpoint.
