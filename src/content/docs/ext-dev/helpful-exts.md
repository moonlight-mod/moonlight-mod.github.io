---
title: Helpful extensions
description: This is a list of helpful extensions that can be used to aid extension development.
sidebar:
  order: 4
---

## Config options

These aren't extensions, but rather options in the moonlight config:

- `devSearchPaths`: An array of directories to recursively search for built extensions (`manifest.json`).
  - When developing extensions, use the `dist` folder instead of the root folder. This is because the `manifest.json` resides in the root of the source code, but does not have the built files, which wastes time resolving files that will never exist.
- `loggerLevel`: The level to log at. If not set, defaults to `info`.
- `patchAll`: Set to `true` to wrap every Webpack module in a function. This slows down client starts significantly, but can make debugging easier.

## Disable Sentry & No Track

Both of these extensions do not provide any utilities, but prevent your client from sending metrics to Discord, which lessens the risk of moonlight related errors being reported. These should always be enabled. These are not magical tools to prevent account suspension, and you should always consider safety when writing an extension (especially one that makes requests automatically).

## Spacepack

Spacepack allows you to find and inspect Webpack modules. The "Add to global scope" setting is suggested, so you can use Spacepack from within DevTools. See [here](/ext-dev/api#spacepack) for the API.

## DevTools Extensions

Allows you to load custom Chrome extensions into Discord, primarily for debugging. It is suggested to enable this and install [React DevTools](/ext-dev/devtools#react-devtools).
