---
title: Migrating API levels
description: When a moonlight API level increases, all extensions with a different API level will refuse to load.
sidebar:
  order: 11
---

When a moonlight API level increases, all extensions with a different API level will refuse to load. The current API level is 2.

As with every update to moonlight, the following apply:

- The types package must be updated: `pnpm update @moonlight-mod/types`
- The `version` field in your manifest must be updated.
- The `apiLevel` field in your manifest must be set to the latest API level.
- If your extension is on [the official repository](/ext-dev/official-repository), it must be resubmitted and reviewed.

## 1 -> 2

The concept of an API level was introduced with API level 2. No API level specified is implicitly assumed to be 1.

With the introduction of [mappings](/ext-dev/mappings), a lot of helper Webpack modules from the Common extension are gone, and moved into the mappings repository. Some notable examples:

- `common_flux`: `discord/packages/flux`
- `common_fluxDispatcher`: `discord/Dispatcher`
- `common_react`: `react`
- `common_components`: `discord/components/common/index`
