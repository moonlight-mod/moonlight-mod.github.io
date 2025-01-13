---
title: Recovering from crashes
description: How to fix your client if it crashes on startup
sidebar:
  order: 2
---

When Discord updates, there is a chance for moonlight (or the extensions you use) to break. In the event your Discord client is broken, follow these steps to recover it.

## Report the issue

In order for us to fix a bug, we need to know about it first! Bugs with moonlight itself can be reported [on GitHub issues](https://github.com/moonlight-mod/moonlight/issues) or in [the Discord server](https://discord.gg/FdZBTFCP6F). Bugs with extensions can be reported on the developer's Git repository (if issues are open).

:::note
Please check if the issue has already been reported beforehand. Reporting the same issue multiple times quickly overwhelms our ability to provide support.
:::

## Update moonlight

moonlight itself can be updated from a number of ways:

- The update prompt at the top of Moonbase
- The Discord tray icon (right click > moonlight > Update and restart)
- The Discord crash screen
- The moonlight installer (or however you installed moonlight)

Extensions can be updated from Moonbase. If you cannot access it, moonbase will attempt to let you update extensions from the crash screen itself.

## Reset your config

You can reset your moonlight configuration through the moonlight installer or the Discord tray icon. Clicking it will backup and reset your config. When you restart Discord, your client will act like you installed moonlight for the first time, with all extensions disabled and all settings reset.

You can also edit the config file manually, if you wish. See [the manual installation instructions](/using/install#manual-installations) for the config path.

## Unpatch moonlight

If all else fails, you can unpatch moonlight from the moonlight installer (or however you installed moonlight), and wait for an update to moonlight. We try and fix things as soon as possible, but please remember we are a team of volunteers building software in our free time.
