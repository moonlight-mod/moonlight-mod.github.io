---
title: Extension manifests
description: The file that defines your extension
sidebar:
  order: 4
---

The extension manifest contains metadata about your extension. It is used to display information to the user in Moonbase, checking required dependencies, and the [API level](/ext-dev/migrating-api-levels).

If your editor supports [JSON Schema](https://json-schema.org/), a schema for the manifest is available [here](https://moonlight-mod.github.io/manifest.schema.json). You can also reference [the type in the moonlight source code](https://github.com/moonlight-mod/moonlight/blob/main/packages/types/src/extension.ts).

This is an example manifest, with every value filled in:

```json title="manifest.json"
{
  "$schema": "https://moonlight-mod.github.io/manifest.schema.json",
  "id": "example",
  "version": "1.0.0",
  "apiLevel": 2,
  "environment": "both", // restricts loading to a certain platform
  "meta": {
    "name": "Example",
    "tagline": "A short tagline that appears below the name",
    "description": "A longer description that can **use Markdown**",
    "authors": [
      "You!",
      {
        "id": "42069", // currently unused
        "name": "Also you!"
      }
    ],
    "deprecated": true,
    "tags": ["qol", "chat"],
    "source": "https://github.com/moonlight-mod/moonlight"
  },

  // these are extension IDs
  "dependencies": ["foo"],
  "suggested": ["bar"],
  "incompatible": ["baz"],

  // see below for the various settings types
  "settings": {
    "exampleSetting": {
      "displayName": "Example setting",
      "type": "boolean",
      "default": true
    }
  },

  // extra URLs to allow/block
  "cors": ["https://example.com"],
  "blocked": ["https://example.com"]
}
```

## Dependencies

Some extensions depend on other extensions to function, like using an extension as a library. Your extension should always declare the extensions it depends on in its manifest:

```json title="manifest.json"
{
  "dependencies": ["markdown"]
}
```

Additionally, when using Webpack modules from other extensions, you must [declare a dependency for your module](/ext-dev/webpack#webpack-module-dependencies) too.

moonlight will implicitly enable the extensions that your extension depends on. For extensions that aren't locally present (e.g. libraries present on an extension repository), Moonbase will prompt the user to install the required dependencies.

## Settings

There are many settings types that you can use to configure your extension in Moonbase. The types for these are available [here](https://github.com/moonlight-mod/moonlight/blob/main/packages/types/src/config.ts).

All settings types take optional `displayName` and `description` arguments, as well as a `default`. If a default is not provided, and the user hasn't configured the extension, the value returned from `moonlight.getConfigOption` will be undefined.

Note that the type defined is purely for what component to use in Moonbase - it is up to you to ensure that you save the right type to the config file.

### `boolean`

Displays as a simple switch.

### `number`

Displays as a simple slider.

- `min?: number` - The minimum value for the slider.
- `max?: number` - The maximum value for the slider.

### `string`

Displays as a single line string input.

### `multilinestring`

Displays as a multiple line string input.

### `select`

A dropdown to pick between one of many values.

- `options: SelectOption[]` - The options to choose.
  - Either a `string` or `{ value: string; label: string; }`.

### `multiselect`

Same as `select`, but can pick multiple values.

- `options: string[]` - The options to choose.

### `list`

A list of strings that the user can add or remove from.

### `dictionary`

A dictionary (key-value pair) that the user can add or remove from.

### `custom`

A custom component. You can use the `registerConfigComponent` function in [the Moonbase API](https://github.com/moonlight-mod/moonlight/blob/main/packages/core-extensions/src/moonbase/webpackModules/moonbase.ts) to register a React component to render here.
