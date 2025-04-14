---
title: Writing core extensions
sidebar:
  order: 6
---

Core extensions are extensions built into moonlight. They are usually libraries or important features.

Core extensions cannot be uninstalled, but they can be disabled. Some core extensions are enabled by default when moonlight is installed for the first time.

The biggest core extension is [Moonbase](https://github.com/moonlight-mod/moonlight/tree/main/packages/core-extensions/src/moonbase), which is responsible for installing and updating extensions, updating moonlight itself, and providing a UI to manage everything. moonlight's core does not contain any functionality for installing/updating extensions or updating moonlight, and it is instead implemented inside of Moonbase.

## Developing core extensions

Core extensions live in the `packages/core-extensions` folder in the moonlight repository. As such, adding new core extensions must be done in a [pull request](/dev/setup).

Keep in mind that moonlight currently [uses a separate build system](/dev/project-structure#build-system) from other external extensions, so there may be more bugs, and some changes may not apply until you [restart the development server](/ext-dev/getting-started#edit-and-reload-your-extension).

## Creating a new core extension

Before you create a core extension, consider if your extension idea is a good fit for a core extension. An extension is a good fit for a core extension if it's a library or development tool, but actual features or tweaks should usually be distributed on a extension repository instead. This isn't a hard rule, though, so feel free to ask if you're considering making a core extension!

After cloning moonlight, simply create a new folder with a `manifest.json` inside of it, and structure it like a normal moonlight extension. The extension manifest should not contain a `version` or `meta.source`.

## Adding types

The types for core extensions should be placed in the `types` package so other extensions can use them.

- Create a new file in the `coreExtensions` folder, and export the types from there.
- Re-export the types in `coreExtensions.ts`.
- Register the type in the Webpack require function in `discord/require.ts`.
- Register the type for module imports in `import.d.ts`.
