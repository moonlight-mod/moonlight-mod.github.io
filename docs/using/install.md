# Installation

moonlight in its current stage does not have any installer, but you can install it manually.

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
>   require.resolve("../_app.asar")
> );
> ```

Adjust the `/path/to/moonlight/dist` to point to the `dist` folder in your locally cloned moonlight install.

After first launch, moonlight will create a config directory in the Electron `appData` path named `moonlight-mod`. Each Discord branch has its own `.json` file for configuration.
