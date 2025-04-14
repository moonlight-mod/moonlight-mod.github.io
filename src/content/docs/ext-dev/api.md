---
title: Extension APIs
description: moonlight-provided APIs and libraries
sidebar:
  order: 7
---

## moonlight globals

The global types are available [here](https://github.com/moonlight-mod/moonlight/blob/main/packages/types/src/globals.ts). Read the comments for more information. What globals you can use depends on [the current environment](/ext-dev/cookbook#extension-entrypoints):

- `moonlight`: available in the web environment (`index.ts`, Webpack modules)
  - Contains patching and Webpack module information, the API level, localStorage, LunAST, moonmap
- `moonlightNode`: available in the web *and* Node.js environments
  - Contains configuration details, browser checks
  - Polyfilled in the browser extension
- `moonlightNodeSandboxed`: available in the host and Node.js environments (`host.ts`, `node.ts`)
  - Contains filesystem APIs
- `moonlightHost`: available in the host environment (`host.ts`)
  - Contains configuration details, `.asar` path

## Extension libraries

These libraries are built into moonlight as [core extensions](/dev/core-extensions). Remember to [add the extension dependency](/ext-dev/cookbook#using-another-extension-as-a-library) and [add the module dependency](/ext-dev/webpack#webpack-module-dependencies) before using these libraries.

### App Panels

Add custom "app panels" next to the user area and mute buttons.

- Module ID: `appPanels_appPanels`
- Types: [here](https://github.com/moonlight-mod/moonlight/blob/main/packages/types/src/coreExtensions/appPanels.ts)

### Commands

Register slash commands and perform text manipulation.

- Module ID: `commands_commands`
- Types: [here](https://github.com/moonlight-mod/moonlight/blob/main/packages/types/src/coreExtensions/commands.ts)

### Common

Provides re-exports of Flux stores, and a custom error boundary component.

- Module IDs: `common_stores`, `common_ErrorBoundary`
- Types: [here](https://github.com/moonlight-mod/moonlight/blob/main/packages/types/src/coreExtensions/common.ts)

### Component Editor

Add custom elements to commonly edited components.

- Module IDs: `componentEditor_dmList`, `componentEditor_memberList`, `componentEditor_messages`
- Types: [here](https://github.com/moonlight-mod/moonlight/blob/main/packages/types/src/coreExtensions/componentEditor.ts)

### Context Menu

Create additional items on existing context menus.

- Module ID: `contextMenu_contextMenu`
- Types: [here](https://github.com/moonlight-mod/moonlight/blob/main/packages/types/src/coreExtensions/contextMenu.ts)

### Markdown

Register custom Markdown rules for rendering chat messages.

- Module ID: `markdown_markdown`
- Types: [here](https://github.com/moonlight-mod/moonlight/blob/main/packages/types/src/coreExtensions/markdown.ts)

### Notices

Add banners (known as "notices") to the top of the client window.

- Module ID: `notices_notices`
- Types: [here](https://github.com/moonlight-mod/moonlight/blob/main/packages/types/src/coreExtensions/notices.ts)

### Settings

Add custom entries to Discord's settings page.

- Module ID: `settings_settings`
- Types: [here](https://github.com/moonlight-mod/moonlight/blob/main/packages/types/src/coreExtensions/settings.ts)

### Spacepack

Find and inspect existing Webpack modules.

- Module ID: `spacepack_spacepack`
- Types: [here](https://github.com/moonlight-mod/moonlight/blob/main/packages/types/src/coreExtensions/spacepack.ts)
