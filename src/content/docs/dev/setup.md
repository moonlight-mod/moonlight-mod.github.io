---
title: Project setup
description: Information on moonlight's project structure and build system
sidebar:
  order: 1
---


You will need [pnpm](https://pnpm.io), as moonlight uses it for dependency and workspace management.

- Clone the repository.
- Install dependencies with `pnpm i`.
- Build the project with `pnpm run build`.
  - For working on moonlight, a watch mode is available with `pnpm run dev`.

## Project structure

moonlight is split into a [pnpm workspace](https://pnpm.io/workspaces). The project is comprised of multiple packages:

- `core`: core code and utilities responsible for loading extensions
- `injector`: the entrypoint for moonlight loaded by the patched Discord client
  - loads the config and detected extensions from disk and forwards them to the other stages
  - loads host modules
  - sets up `node-preload` to be ran when the browser window is created
- `node-preload`: ran before Discord's code on the Node side
  - receives the config/detected extensions from `injector` and forwards it to `web-preload`
  - loads node modules
  - loads `web-preload` and forwards some inforation to it
- `web-preload`: ran before Discord's code on the web side
  - receives the loaded config and detected extensions from `node-preload`
  - loads extensions and installs their Webpack modules and patches
- `core-extensions`: built-in extensions that come with every moonlight install, mostly libraries
- `types`: types for moonlight's core, core extensions, and extension manifests/exports

## Build system

moonlight uses [esbuild](https://esbuild.github.io) as its build system (`build.mjs`). This script is responsible for outputting `injector`, `node-preload`, and `web-preload` into `dist`, along with all core extensions.

## Other dependencies

moonlight uses some other packages that are not in the monorepo, like [LunAST](https://github.com/moonlight-mod/lunast), [moonmap](https://github.com/moonlight-mod/moonmap), and [mappings](https://github.com/moonlight-mod/mappings). When testing local forks, try [pnpm link](https://pnpm.io/cli/link).
