---
title: Using DevTools
description: The Chrome DevTools is a panel/window that offers several utilities for web development. Normally, it is intended for the creators of the target application, but it also serves as an excellent tool for client modders.
sidebar:
  order: 9
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

The returned value will be a function you can double click to see the module source.

You can chain `inspect` with `findByCode` (or an equivalent) when trying to find the source of a patch in a rush:

```js
spacepack.inspect(spacepack.findByCode(/* finds */)[0].id)
```

Also see [this page](/ext-dev/webpack#common-patterns) for common patterns to look out for.

## Using the Sources tab

- Minimize the navigator by clicking "Hide navigator" on the top left. This introduces a severe amount of lag by having it open.
- The bottom left "Pretty print" button can be used to make the output more readable.
  - Toggle on pretty print when reading and debugging code.
  - Toggle off pretty print when testing or writing patches.
- When testing patches, use Find (Ctrl+F) and enable regex mode on the right side, and paste the find in without the surrounding slashes (`/`).

## Using the debugger

You can set breakpoints on Webpack modules to inspect the variables at runtime. Click on the left line number area to set a breakpoint. See variables in breakpoints (and toggle breakpoints) on the right sidebar.

## React DevTools

React DevTools allows you to inspect the React component tree easier, instead of its representation with the DOM. You can view the sources of components and their props this way.

Either [use the rehosted version](https://moon.light.pm/files/reactdevtools.zip) or [download the extension and extract it yourself](https://react.dev/learn/react-developer-tools). Use the "DevTools Extensions" extension to load it. A new Components tab will appear in DevTools.

You can use the element picker to select components. Props are available on the right side. Click the bug icon to view data about the component. Click the bracket icon to view the source of the component.

For best results, enable "Patch all" in the moonlight settings.
