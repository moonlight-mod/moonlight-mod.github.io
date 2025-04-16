---
title: Getting started
description: How to make your own moonlight extension
sidebar:
  order: 1
---

:::note
This page is for developers who want to make their own extensions. If you're looking for documentation on using moonlight itself, see [here](/using/getting-started).
:::

## Requirements

- [Node.js](https://nodejs.org) 22 or later
- [pnpm](https://pnpm.io) 10 or later
- A text editor or IDE
  - We suggest [Visual Studio Code](https://code.visualstudio.com/), but you can use whatever you'd like.
- Git
  - If you're new to using Git, you may want to use a GUI client. We suggest [GitHub Desktop](https://github.com/apps/desktop).

## Suggested knowledge

- JavaScript/TypeScript
  - We strongly recommend using TypeScript, but if you're not comfortable with it, you can use JavaScript instead.
- [React](https://react.dev/) (if you plan to interact with the UI)
  - You should be comfortable with [the component model](https://react.dev/learn/your-first-component) and [how props work](https://react.dev/learn/passing-props-to-a-component). Some old UI uses [class components](https://react.dev/reference/react/Component), but most use [function components](https://react.dev/learn/your-first-component#defining-a-component).
  - If you plan to write your own components, you should know [how to manage React state](https://react.dev/learn/managing-state) and [JSX](https://react.dev/learn/writing-markup-with-jsx).
- Reading and writing [regexes](https://en.wikipedia.org/wiki/Regular_expression) (if you plan to write patches)
  - We suggest [regex101](https://regex101.com/) as a good resource for learning regex.

You don't need to be an expert (or have worked) in the above subjects, but it makes creating extensions much easier. We believe in learning by doing, so don't be afraid to [ask for help in our Discord server](https://discord.gg/FdZBTFCP6F) or reference other extensions.

moonlight has a lot of libraries and modules for common utilities, but sometimes you'll need to do something that hasn't been discovered before, and you'll need to reverse engineer Discord yourself. Understanding Discord's code can be tough for beginners, so we encourage you to ask for help if you're stuck. A creative mindset and thinking outside the box goes a long way, though!

Reading how other extensions work can be a huge resource, so we encourage you to reference [the moonlight core extensions](https://github.com/moonlight-mod/moonlight/tree/main/packages/core-extensions/src) and [the extensions on the official repository](https://github.com/moonlight-mod/extensions/tree/main/exts). Just remember to respect the licensing of the extension!

## Create your extension

Before you create your extension, you'll need to decide on a few things first:

- Pick a user-facing name for your extension. This will be displayed to the user in Moonbase. We suggest a short but informational one.
  - Gimmick names [are fun to use](https://github.com/moonlight-mod/moonlight/tree/main/packages/core-extensions/src/spacepack), but they can confuse users. If your extension's name doesn't describe its functionality well, make sure you clarify what your extension does in the tagline.
  - Treat it as a proper noun ("Native Fixes" instead of "Native fixes").
- Pick an ID for your extension. This is used internally by moonlight. We suggest picking the name of your extension in `camelCase`:
  - Context Menu -> `contextMenu`
  - Moonbase -> `moonbase`
  - No Hide Token -> `noHideToken`

:::caution
**Extension IDs are constant and cannot change!** Many things depend on the ID as a source of truth (extension loading, installing & updating, the official repository, etc). While you can change the user-facing name of the extension, you can never modify the ID.

Make sure you use the same ID everywhere (folder name, extension manifest, etc).
:::

Now, run this command in your terminal and follow the instructions:

```shell
pnpm create @moonlight-mod/extension
```

After it's done, open the newly created folder in your text editor or IDE, and update your extension's `manifest.json`:

- Change `name` to your user-facing extension name.
- Change `tagline` to a short explanation of your extension.
- Change (or delete) `description`. If you have any important notes about the extension's functionality, you should add them here. This field is optional.
- Change `authors` to properly credit yourself.
- Change `source` to the URL of your Git repository.

Now is a good time to take a look around the rest of the files - most of them are commented.

:::note
We *heavily* encourage you to add a `LICENSE` to your repository. Most extension developers pick [MIT](https://opensource.org/license/mit) or [GPL-3.0](https://opensource.org/license/gpl-3-0), but you can use whatever you'd like, as long as it's compatible.

Also, consider adding a short `README.md` to your repository.
:::

## Build and run your extension

If you haven't already, run `pnpm install` to install all dependencies. Run `pnpm run build` to build the extension. Next to the `src` folder, a `dist` folder will appear, which contains the built extension inside of it.

Add the `dist` folder to the "Extension search paths" setting in Moonbase (or set `devSearchPaths` in your moonlight config). After restarting your client, your extension will appear in Moonbase, and you can enable it to start using your extension.

:::caution
**Only add the `dist` folder to the search paths!** If you add the entire repository, moonlight will attempt to load your extension twice, as it will see the `manifest.json` in both `src` and `dist`. Make sure you specify the `dist` folder, as moonlight will only detect the built extension.
:::

Right now, your extension doesn't do much. Let's go over what each file does:

- `manifest.json` contains all of the metadata about your extension. Every extension has a manifest.
- In `index.ts`, your extension exports its [patches](/ext-dev/webpack#patching) and [Webpack modules](/ext-dev/webpack#webpack-module-insertion). Make sure to export every patch and Webpack module you create, or else moonlight won't load them.
- If you open the Discord settings menu, you should see the "User Settings" section has been renamed to "hacked by (your extension ID) lol". This was edited by the patch in `index.ts`, which modifies Discord to insert and replace custom code.
- In the `webpackModules` folder, there are multiple Webpack modules, which is where most of your extension's code lives. Right now, all they do is log to the console.
- In `node.ts`, your extension runs [in the Node environment](/ext-dev/cookbook#extension-entrypoints), where you can access the filesystem or spawn extra processes. Most extensions don't need to use this, though.
- In `env.d.ts` (at the root of the repository), your extension's Webpack module is declared to let you import it directly. Make sure to update this file when you add or remove Webpack modules, but don't delete it entirely.

We suggest keeping these examples around for experimentation, but you should delete what you aren't using before you publish your extension. Most extensions don't use `node.ts`, for example.

## Edit and reload your extension

Run `pnpm run dev` to enter watch mode. When you make changes to your extension, the extension will automatically be rebuilt, and you can reload your client (`Ctrl+R`) to load the new version of your extension.

:::note
Watch mode will need to be restarted when making certain changes or adding/removing new entrypoints. See [here](/ext-dev/pitfalls#restarting-dev-mode-is-required-in-some-scenarios) for more information.
:::

Try changing one of the logger messages, or maybe edit the example patch. Play around a bit and see what happens!

## Publish your extension

Once you're ready to share your code with the world, [create a new GitHub repository](https://github.com/new).

:::note
We suggest hosting your extension on GitHub, but you can choose any Git forge you like! If you host your extension somewhere else, this section doesn't apply to you.
:::

In the repository settings, make sure GitHub Actions is enabled for your repository, and that the GitHub Pages source is set to GitHub Actions:

- GitHub Actions: "Code and automation" > "Actions" > "General" > "Actions permissions"
- GitHub Pages: "Code and automation" > "Pages" > "Build and deployment" > "Source"

:::note
If you already pushed your extension to the repository, you may get an email about a failed run. This is likely because these settings haven't been configured yet. You can safely ignore this warning for now, and once these settings are applied, this shouldn't happen again.
:::

Now that your repository is set up, commit your extension to your new repository. Every time a commit is made to the `main` branch, your extension will be built with GitHub Actions, and published on GitHub Pages at `https://<username>.github.io/<repository>/repo.json`.

You can start using this repository URL right away, but we suggest ignoring it for now and [submitting to the official repository](/ext-dev/official-repository). If you don't want this to be automatically published, you can also delete the `.github/workflows/deploy.yml` file and turn off GitHub Pages.

## What's next?

Congrats on making it this far! There's a lot more to learn about how moonlight works:

- [Set up DevTools](/ext-dev/devtools) to view the console and reverse engineer Discord.
- [Read about Webpack modules](/ext-dev/webpack), and learn how to write your own patches and make your own Webpack modules.
- [Read the cookbook](/ext-dev/cookbook) for common patterns you may want to use in your extension.
- [Read common pitfalls](/ext-dev/pitfalls) so you know to avoid them.
- When your extension is ready, [submit your extension to the official repository](/ext-dev/official-repository) or [distribute it on a custom repository](#publish-your-extension).

If you need any help, don't be afraid to [ask in our Discord server](https://discord.gg/FdZBTFCP6F).

## Making a second extension

If you've decided to make a second extension, you don't need to make a separate repository for it. Simply run the `pnpm create` command again, but this time inside of the existing repository. It'll automatically detect the existing repository and create a new extension for you.

## Updating your repository

You should update the dependencies of your repository regularly. This command updates the types package:

```shell
pnpm update @moonlight-mod/types
```

You might need to update other packages (like `@moonlight-mod/esbuild-config`) to stay up to date. In some scenarios, manually updating or replacing files may be required, so [check our communication channels](/using/communications) if there is any manual updates required.

When updating your extension to a new API level, follow the instructions [here](/ext-dev/migrating-api-levels).
