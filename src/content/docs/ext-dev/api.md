---
title: Extension APIs
description: moonlight-provided APIs and libraries
sidebar:
  order: 6
---

## moonlight globals

The global types are available [here](https://github.com/moonlight-mod/moonlight/blob/main/packages/types/src/globals.ts). Read the comments for more information. What globals you can use depends on [the current environment](/ext-dev/cookbook#extension-entrypoints):

- `moonlight`: available in the web environment
- `moonlightNode`: available in the web *and* Node.js environments
- `moonlightHost`: available in the host environment

## Extension libraries

Remember to [add the module as a dependency](/ext-dev/webpack/#webpack-module-dependencies).

### Context Menu

- Module ID: `contextMenu_contextMenu`
- Types: [here](https://github.com/moonlight-mod/moonlight/blob/main/packages/types/src/coreExtensions/contextMenu.ts)

### Markdown

- Module ID: `markdown_markdown`
- Types: [here](https://github.com/moonlight-mod/moonlight/blob/main/packages/types/src/coreExtensions/markdown.ts)

### Notices

- Module ID: `notices_notices`
- Types: [here](https://github.com/moonlight-mod/moonlight/blob/main/packages/types/src/coreExtensions/notices.ts)

### Settings

- Module ID: `settings_settings`
- Types: [here](https://github.com/moonlight-mod/moonlight/blob/main/packages/types/src/coreExtensions/settings.ts)

### Spacepack

- Module ID: `spacepack_spacepack`
- Types: [here](https://github.com/moonlight-mod/moonlight/blob/main/packages/types/src/coreExtensions/spacepack.ts)
