# Installation

There are two ways to install moonlight: through an experimental GUI installer, or manually building it yourself. Installs via the automatic launchers are heavily recommended for users. **moonlight is currently experimental and is not suggested for end users. If you are not a developer, please refrain from installing moonlight at this time.**

## moonlight-installer

The moonlight [installer](https://github.com/moonlight-mod/moonlight-installer) automates the installation process for you, and is the recommended way of installing.

To use it, [download](https://github.com/moonlight-mod/moonlight-installer/releases/latest) and run the installer, download moonlight through it, and then patch a Discord installation. Discord installations are autodetected on your machine.

## Manual installations

- [Build moonlight](/docs/dev/setup).
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
