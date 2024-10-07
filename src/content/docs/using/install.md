---
title: Installation
description: How to install, build, and use moonlight
sidebar:
  order: 1
---

There are two ways to install moonlight: through an experimental GUI installer, or manually building it yourself. If you do not plan to develop on the moonlight codebase itself, it is suggested to use the installer.

## moonlight installer

The moonlight [installer](https://github.com/moonlight-mod/moonlight-installer) automates the installation process for you. To use it, [download](https://github.com/moonlight-mod/moonlight-installer/releases/latest) and run the installer, download moonlight through it, and then patch a Discord installation. Discord installations are autodetected on your machine.

## moonlight-cli

A [command line installer](https://github.com/moonlight-mod/moonlight-installer/main/crates/moonlight-cli) can be compiled from source manually and used to patch moonlight:

```shell
moonlight-cli install stable
moonlight-cli patch /path/to/discord/executable
```

## Manual installations

- [Build moonlight](/dev/setup).
- Go to your Discord install's `resources` folder.
- Rename the `app.asar` to `_app.asar`, and create an `app` folder. Discord will load the folder instead of the `.asar` now that it has been renamed.
- Create the following files:

> `resources/app/package.json`:
>
> ```json
> {
>   "name": "discord",
>   "main": "./injector.js",
>   "private": true
> }
> ```
>
> `resources/app/injector.js`:
>
> ```js
> require("/path/to/moonlight/dist/injector").inject(
>   require("path").join(__dirname, "../_app.asar")
> );
> ```

Adjust the `/path/to/moonlight/dist` to point to the `dist` folder in your locally cloned moonlight install.

After first launch, moonlight will create a config directory in the Electron `appData` path named `moonlight-mod`. Each Discord branch has its own `.json` file for configuration.

## Browser

moonlight optionally runs in the browser. To use it, [build moonlight](/dev/setup), and then build the browser extension:

- Manifest v3 (Chrome): `pnpm run browser`
- Manifest v2 (Firefox): `pnpm run browser-mv2`

The output extension will be at `dist/browser`. Chrome users can check "Developer mode" and click "Load unpacked" in `chrome://extensions`, and Firefox users can click "Load Temporary Add-on" in `about:debugging`.

Browser support is experimental and may be unreliable. Developing extensions or using custom repositories is not supported with the browser extension.

## rocketship

Linux users can install a custom Discord build with [rocketship](https://github.com/moonlight-mod/rocketship) and then install moonlight into it. Enable the rocketship extension after installation.
