---
title: Getting started
description: Information on getting started with moonlight extension development
sidebar:
  order: 1
---

## Requirements

- [Node.js](https://nodejs.org/en)
- [pnpm](https://pnpm.io)
- A text editor
  - We suggest [Visual Studio Code](https://code.visualstudio.com/), but you can use whatever you'd like.
- Git
  - If Git is new to you, you may want to use a GUI client like [GitHub Desktop](https://github.com/apps/desktop).

## Suggested knowledge

- JavaScript/TypeScript
  - If you're not comfortable with TypeScript, you can use JavaScript. It is strongly recommended to use TypeScript.
- [React](https://react.dev/) (if you plan to modify the UI)
  - You should be comfortable with [the component model](https://react.dev/learn/your-first-component) and [how props work](https://react.dev/learn/passing-props-to-a-component). Some old UI uses [class components](https://react.dev/reference/react/Component), but most use [function components](https://react.dev/learn/your-first-component#defining-a-component).
  - If you plan to write your own components, you should know [how to manage React state](https://react.dev/learn/managing-state) and [JSX](https://react.dev/learn/writing-markup-with-jsx).
- Reading and writing [regexes](https://en.wikipedia.org/wiki/Regular_expression) (if you plan to write patches)
  - We suggest [regex101](https://regex101.com/) as a good resource for learning regex.

You don't need to be an expert (or have worked) in the above subjects, but it makes creating extensions much easier. We believe in learning by doing, so don't be afraid to [ask for help in our Discord server](https://discord.gg/FdZBTFCP6F) or reference other extensions.

Reading how other extensions work can be a huge resource, so we encourage you to reference [the moonlight core extensions](https://github.com/moonlight-mod/moonlight/tree/main/packages/core-extensions/src) and [the extensions on the official repository](https://github.com/moonlight-mod/extensions/tree/main/exts) if you're stuck. Just remember to respect the licensing of the extension!

## Create your extension

The `create-extension` CLI tool can help you scaffold a new moonlight extension repository:

- Configured like a monorepo, so multiple extensions can live in the same Git repository
- Pre-configured build system (esbuild)
- Pre-configured formatter and linter (Prettier and ESLint)
- TypeScript support
- Example usage of [patching](/ext-dev/webpack#patching), [Webpack modules](/ext-dev/webpack#webpack-module-insertion), and [Node.js code](/ext-dev/cookbook#extension-entrypoints)

You'll need to decide on a few things first:

- Pick a name for your extension. This will be displayed to the user in Moonbase. We suggest a short but informational one.
  - Avoid using gimmick names where possible ~~[except if you can't resist it](https://github.com/moonlight-mod/moonlight/tree/main/packages/core-extensions/src/spacepack)~~.
  - Treat it as a proper noun ("Native Fixes" instead of "Native fixes").
- Pick an ID for your extension. We suggest using the name of your extension in `camelCase`:
  - Context Menu -> `contextMenu`
  - Moonbase -> `moonbase`
  - No Hide Token -> `noHideToken`

:::caution
**Extension IDs are constant and cannot change!** Many things depend on the ID as a source of truth (extension loading, installing & updating, the official repository, etc).

You can change the user-facing name of the extension, but never modify the ID.
:::

Now, run this command and follow the instructions:

```shell
$ pnpm create @moonlight-mod/extension
```

After the project is created, change the `meta` field in `manifest.json`:

- Change `name` to your user-facing extension name.
- Change `tagline` to a short explanation of your extension.
- Change or delete `description` to a longer explanation of your extension. If you have any important notes about the extension's functionality, add them here.
- Change `authors` to contain your username.
- Change `source` to the URL of your Git repository.

Now is a good time to take a look around the rest of the files - most of them are commented. We strongly suggest adding a short README to your project, as well as a LICENSE.

## Build and run the extension

Run `pnpm run build` to build the extension. If you get an error, you might have forgotten to install the dependencies (`pnpm i`). Use the "Extension search paths" setting in Moonbase (or set `devSearchPaths` in your moonlight config) to add the `dist` folder next to your code. If you don't have a `dist` folder, you need to build the extension first.

:::note
Do not add the directory with your code. moonlight will only be able to load the extensions from the `dist` folder in your repository.
:::

After restarting your client, the extension will be available in Moonbase and you can enable it. We suggest using watch mode (`pnpm run dev`) when developing your extension to build it automatically.

:::note
Watch mode will need to be restarted if you edit the extension manifest, add/remove an entrypoint, or add/remove a Webpack module. If you delete an extension, entrypoint, or Webpack module, you should run `pnpm run clean` to clean up the remaining build output.
:::

## Publish to GitHub

We suggest publishing to GitHub to make use of the provided GitHub workflow. You can choose any Git host you like, though!

In the repository settings, make sure GitHub Actions is enabled for your repository, and that the GitHub Pages source is set to GitHub Actions:

- GitHub Actions: "Code and automation" > "Actions" > "General" > "Actions permissions"
- GitHub Pages: "Code and automation" > "Pages" > "Build and deployment" > "Source"

:::note
Don't worry if you get an email about a "failed run". This is likely because these settings haven't been configured yet. Once they're set, this shouldn't happen again.
:::

Your repository will be published to `https://<username>.github.io/<repository>/repo.json`. Every time a commit is made to the main branch, the extensions will be built on GitHub Actions and published automatically.

It is suggested to only use this if you do not plan to submit to the [official repository](/ext-dev/official-repository). You can also delete the `.github/workflows/deploy.yml` file if you do not want this (or if you aren't using GitHub).

## What's next?

Congrats on making it this far! There's a lot more to learn about how moonlight works:

- [Read about Webpack modules](/ext-dev/webpack), and learn how to write your own patches & make your own Webpack modules.
- [Read the cookbook](/ext-dev/cookbook) for common patterns you may want to use.
- [Set up DevTools](/ext-dev/devtools) to make reverse engineering Discord easier.
- [Read common pitfalls](/ext-dev/pitfalls) so you know to avoid them.
- When your extension is ready, [submit to the official repository](/ext-dev/official-repository) or [distribute the extension on a custom repository](#publish-to-github).

If you need any help, don't be afraid to [ask in our Discord server](https://discord.gg/FdZBTFCP6F).
