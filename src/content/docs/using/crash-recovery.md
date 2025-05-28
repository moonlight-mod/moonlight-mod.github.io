---
title: Recovering from crashes
description: How to fix your client if it crashes on startup
sidebar:
  order: 3
---

When Discord updates, there is a chance for moonlight (or the extensions you use) to break. In the event your Discord client is broken, follow these steps to recover it.

## Report the issue

In order for us to fix a bug, we need to know about it first! Bugs with moonlight itself can be reported [on GitHub issues](https://github.com/moonlight-mod/moonlight/issues) or in [the Discord server](https://discord.gg/FdZBTFCP6F). Bugs with extensions can be reported on the developer's Git repository (if issues are open).

:::note
Please check if the issue has already been reported beforehand. Reporting the same issue multiple times quickly overwhelms our ability to provide support.
:::

### Finding Discord's logs

When troubleshooting issues with moonlight, you may be asked to provide Discord's logs by a moonlight core developer.

:::caution
These logs contain a lot of information that may be sensitive to you (e.g. your computer username or the IDs of channels you recently visited). We suggest privately DMing these logs instead of posting them in a public channel.
:::

These logs are present in Discord's config folder:

- Windows: `%AppData%/discord`
- Linux:
  - Normal: `~/.config/discord`
  - Flatpak: `~/.var/app/com.discord.Discord/config/discord`

The folder name changes depending on your Discord branch (e.g. `discordptb` or `discordcanary`).

Discord's logs will be present in the `logs` folder. You should send `renderer_js.log`, as the other log files are usually unrelated.

## Update moonlight

moonlight itself can be updated from a number of ways:

- The update prompt at the top of Moonbase
- The Discord tray icon (right click > moonlight > Update and restart)
- The Discord crash screen
- The moonlight installer (or however you installed moonlight)

Extensions can be updated from Moonbase. If you cannot access it, Moonbase will attempt to let you update extensions from the crash screen itself.

## Reset your config

You can reset your moonlight configuration through the moonlight installer or the Discord tray icon. Clicking it will backup and reset your config. When you restart Discord, your client will act like you installed moonlight for the first time, with all extensions disabled and all settings reset.

You can also [edit the config file manually](/using/getting-started#editing-moonlights-config) if you wish.

## Unpatch moonlight

If all else fails, you can unpatch moonlight from the moonlight installer (or however you installed moonlight), and wait for an update to moonlight. We try and fix things as soon as possible, but please remember we are a team of volunteers building software in our free time.

Keep an eye out for any status updates on [our communication channels](/using/communications).
