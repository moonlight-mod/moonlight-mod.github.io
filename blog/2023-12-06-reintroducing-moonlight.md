---
title: "(Re)introducing moonlight: Yet another Discord mod"
description: "A new Discord client mod, powered by Webpack patching"
authors: [notnite, cynosphere, adryd]
image: /static/img/wordmark.png
---

A few days ago, we released a new Discord client mod called [moonlight](/). moonlight is the end result of our ideas and experiences from Discord client modding, influenced by several years of working on other client modding projects. We invite developers to try out moonlight and report feedback on what we can improve.

<!-- truncate -->

## Yet another Discord mod

Tens if not hundreds of Discord desktop client mods have come and gone, so why make another? Simple; the freedom to innovate and experiment. With moonlight, we're free to do what we want and experiment with the ideas that we've had for years without any limitations. Creating moonlight has offered a fresh slate to build our own systems and play with what we like most, and allows us to try out new things with zero consequence.

moonlight functions off of [Webpack patching](/docs/ext-dev/webpack) (really Rspack, but whatever) - extension developers can modify minified Discord code through string/RegExp replacements, swap entire Webpack modules out, and insert their own Webpack modules. With [moonlight's Webpack module loading](/docs/ext-dev/esm-webpack-modules), you can import and export in a file like normal, which will be transformed into a Webpack module. This system of patching was inspired and iterated through several other client mods we've used and worked on; notably [yelm](https://github.com/adryd325/yelm), [EndPwn](https://github.com/endpwnarchive), and [HH3](#whats-with-hh3). This patching system is also seen in some modern client mods like [Vencord](https://github.com/Vendicated/Vencord).

Despite moonlight being inspired from some other client mods, we don't intend for it to seriously compete with the current playing field; it will mostly be an experimental playground for the foreseeable future. Don't let this stop you from trying it, though! We'll do our best to maintain moonlight and establish a stable API as soon as possible.

## Getting started with moonlight

For installing moonlight, refer to [manual instructions](/docs/using/install) or [our experimental GUI installer](https://github.com/moonlight-mod/moonlight-installer). For extension development, see [this documentation entry](/docs/ext-dev/getting-started). The documentation tab has lots of information on setting up development environments for extensions and moonlight itself.

If you feel like anything's unclear, please [let us know in our Discord server](https://discord.gg/FdZBTFCP6F) or [make a pull request to this website](https://github.com/moonlight-mod/moonlight-mod.github.io).

## The stable and not-so-stable

moonlight has a lot of features we're currently working on that may change at any moment. At the current moment, its API is under heavy development and breaking changes will be made. With the help of other developers to try it out and contribute ideas and feedback, we aim to stabilize it soon.

moonlight functions under two release channels: a stable channel (published to GitHub releases on every version), and a nightly channel (published to GitHub Pages through GitHub Actions on every commit to the develop branch). In this experimental development period, we suggest developers use nightly when possible (either through the "Nightly" dropdown in the moonlight installer, or by checking out the develop branch in Git).

## Embracing the freedom to develop

We care about the freedom to do what you want with extension development. moonlight is open source under the [LGPL-3.0-or-later license](https://github.com/moonlight-mod/moonlight/blob/main/LICENSE).

Extensions can be loaded from disk, the official extension repository, or remote extension repositories. Anyone can create their own extension repository and publish their own extensions; while submitting to the official extension repository is encouraged, it isn't required. Custom extension repositories are a single .json file that contain URLs to .asar files. The [sample extension](https://github.com/moonlight-mod/sample-extension) publishes the extensions you write as an extension repository to GitHub Pages - everything you need to create a custom extension repository is done for you automatically.

moonlight also comes with a set of core extensions that come pre-installed into the Discord client (but you can disable them). Some of them are libraries (like Common) and some of them are simple utility (like Moonbase, the settings GUI). These libraries have types, which can be utilized when using the Webpack require function, or the special import prefix in [ESM Webpack modules](/docs/ext-dev/esm-webpack-modules). Using third party libraries is as simple as adding a .d.ts to your project.

## What's with HH3?

You may have seen some mentions of an "HH3" on [the landing page](/) or this blog post. This is a private clientmod we work on, currently on its third iteration (hence the name). HH3 functions very similarly to moonlight, having its own Webpack module patching and insertion system. Some parts of moonlight are based off of HH3 or its extensions; we have been cleared for approval to use these parts or wrote them ourselves. For the (very likely small amount of) HH3 users reading this post, let's make it clear that HH3 is not dead, and moonlight is not a successor or competitor to HH3. We will continue to use and maintain both.

Extended thanks and acknowledgment to [Mary](https://github.com/mstrodl) and [twilight sparkle](https://github.com/twilight-sparkle-irl), who've helped build and shape HH3 and what came before it.

## What's next for moonlight

Our roadmap for what we want to do with moonlight is powered by the community. We want to offer developers as much freedom as possible to send feedback and pitch ideas for what we can do. Some guidelines, though:

- Please submit your extensions to the official repository (even if the merge times are upsetting), because having them in one place will help coordinate things.
- If you're going to be developing libraries, please make pull requests to the moonlight core extensions! Your code can benefit everyone.
- Please report bugs [on GitHub issues](https://github.com/moonlight-mod/moonlight/issues), or if you must, in [the Discord server](https://discord.gg/FdZBTFCP6F).
- Please **don't** share this with all of your friends and go "OMG NEW CLIENT MOD". Having a bunch of end users trying to use a client mod that's an active work in progress is a massive headache.

Thanks for reading, and hopefully you enjoy moonlight! \<3

<!-- meow -->
