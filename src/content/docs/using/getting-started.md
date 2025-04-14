---
title: Getting started
description: How to use moonlight
sidebar:
  order: 2
---
Welcome to moonlight! If you haven't installed moonlight already, [do that first](/using/install) and return to this page when you're done.

moonlight features many extensions (usually called "plugins" by other client mods) that change Discord's functionality. These extensions are created by community developers, and anyone can make their own extensions.

## Accessing Moonbase

moonlight is configured through a central settings UI called "Moonbase". A new tab will be available at the top of Discord's settings menu where you can access Moonbase. Within Moonbase, you can [install and configure extensions](#installing-and-using-extensions), as well as [update moonlight](#updating-moonlight).

The Config tab lets you configure moonlight itself. The About tab contains the current version of moonlight you are using.

### Installing and using extensions

moonlight does not come with many extensions pre-installed. You can install extensions within Moonbase.

Each extension has its own card, where you can install or update the extension, as well as enable and disable it. Extensions will usually have a button to view the source code, and there may be a button to donate to the extension developer if they have configured it.

Some extensions can be configured through their settings. Click the "Settings" tab on an extension's card to view the extension's settings.

By default, Moonbase only shows extensions from the main extensions repository. Extension developers can distribute their extensions on their own repository, and you can add custom repositories in the Config tab.

:::caution
Custom extension repositories are unaffiliated with moonlight and are not reviewed by the moonlight core developer team. We cannot guarantee the extensions you install from custom repositories are safe. Only add custom repositories from developers you trust, and use them at your own risk.
:::

## Updating moonlight

moonlight (and its extensions) often need to be updated for compatibility with the latest Discord updates. There is no auto-update system, so you must manually update moonlight.

### moonlight branches

moonlight is split into two separate branches - "Stable" and "Nightly". The Nightly branch gets more frequent updates, but is also more unstable.

You can use whichever branch you like and switch between them at any time. We suggest using the Stable branch if you use the stable version of Discord, and we suggest using the Nightly branch if you use the PTB or Canary versions of Discord.

Sometimes, new Discord updates may be incompatible with moonlight. These updates are rolled out early to Discord PTB and Canary, so we suggest switching to the Nightly branch of moonlight if things are broken on PTB or Canary. See [here](/using/crash-recovery) for more detailed instructions.

## Editing moonlight's config

Sometimes, you may want to manually edit moonlight's config file. You can find it in the `moonlight-mod` folder:

- Windows: `%AppData%/moonlight-mod`
- macOS: `~/Library/Application Support/moonlight-mod`
- Linux: `~/.config/moonlight-mod`

Each Discord branch has its own config file (e.g. `stable.json`, `canary.json`).
