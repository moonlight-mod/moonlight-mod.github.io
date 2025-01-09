---
title: moonlight API v2, mappings, and more
description: New libraries and utilities for a new version of moonlight
date: 2024-10-03
authors: [notnite, cynosphere, adryd]
---

Been a while, eh? The last post we wrote for moonlight was [when we first introduced it](/blog/reintroducing-moonlight). Sounds like it's time to change that!

moonlight development was stalled for a while this year, particularly due to lack of motivation. Fewer people than expected tinkering with moonlight gave us less reason to update it, and so it fell behind with Discord updates, eventually breaking catastrophically for several months. Thanks to [redstonekasi](https://github.com/redstonekasi) for submitting pull requests for fixing a *lot* of things while none of us had the energy to.

About a week ago, [Ari](https://github.com/adryd325) had the idea of making a centralized repository for Discord client mappings. This short conversation would lead to one of the greatest nerdsnipes in moonlight history.

With the new features we're rolling out, this means new concepts of an "API level". Extensions that do not meet the provided API level will not load. If you don't care about the shiny new toys, jump [here](#what-a-version-bump-means-for-you) for more info on that.

## LunAST: AST-based mapping and patching

The concept of centralized mappings started with [LunAST](https://github.com/moonlight-mod/lunast) (Lunar + AST), a library for manipulating Webpack modules with various ESTree-related tools. LunAST enables you to patch and traverse modules using an AST, which is much more flexible than the current text-based patching with RegEx/strings.

Here's the first LunAST patch we ever wrote, as an idea for how it works. This makes it say "balls" when you click on an image preview (very professional, I know):

```ts
import type { AST } from "@moonlight-mod/types";

moonlight.lunast.register({
  name: "ImagePreview",
  find: ".Messages.OPEN_IN_BROWSER",
  process({ id, ast, lunast, markDirty }) {
    const getters = lunast.utils.getPropertyGetters(ast);
    const replacement = lunast.utils
      .magicAST(`return require("common_react").createElement(
  "div",
  {
    style: {
      color: "white",
    },
  },
  "balls"
)`)!;
    for (const data of Object.values(getters)) {
      if (!lunast.utils.is.identifier(data.expression)) continue;

      const node = data.scope.getOwnBinding(data.expression.name);
      if (!node) continue;

      const body = node.path.get<AST.BlockStatement>("body");
      body.replaceWith(replacement);
    }
    markDirty();

    return true;
  }
});
```

This is a very powerful tool, but we aren't sure how well it'll work for extension developers just yet. If you have a particularly complicated patch in your extension codebase, see if LunAST can help you. Some notes, though:

- AST parsing is expensive! Use `find` when possible to filter for modules to parse.
- AST patching might break other text-based patches. If you encounter any weirdness, let us know.
- Text-based patching is not going away, and you should not use AST patching everywhere. This is purely a tool for the harder stuff.

## moonmap: dynamic remapping of Webpack modules

[moonmap](https://github.com/moonlight-mod/moonmap) allows you to find a module, create a proper name for it, and create named exports from minified variable names. This feature was originally in LunAST, but we decided to expand on it and bring it into its own library. Here's a snippet from the mappings project (which we'll get into later):

```ts
const name = "discord/utils/HTTPUtils";
moonlight.moonmap.register({
  name,
  find: '.set("X-Audit-Log-Reason",',
  process({ id, moonmap }) {
    moonmap.addModule(id, name);

    moonmap.addExport(name, "HTTP", {
      type: ModuleExportType.Key,
      find: "patch"
    });

    return true;
  }
});
```

You can then just `spacepack.require("discord/utils/HTTPUtils").HTTP`, and it just works! Magic:tm:.

## mappings: client mod agnostic Discord mappings

[mappings](https://github.com/moonlight-mod/mappings) combines moonmap and LunAST into one project to map out the Discord client. This is an idea that was tested in [HH3](/blog/reintroducing-moonlight#whats-with-hh3), and we believe that it's stable by now.

The biggest feature about the mappings is that they aren't locked into the moonlight patcher system. Any client mod that can implement moonmap and LunAST into their patching system can use the mappings repository with no extra effort. We hope this can save some duplicated effort across the client modding community.

```ts
import load from "@moonlight-mod/mappings";

load(moonmap, lunast);

// later, after the modules finish initializing
const Dispatcher = require("discord/Dispatcher").default;
```

There's still a lot of work to be done for typing the untyped modules, and for adding new modules. We migrated a majority of types in the Common extension into this library, and most of the things in Common have been removed.

## What a version bump means for you

### As a user

All extensions you are currently using (minus the extensions built into moonlight) will stop working. The developers of those extensions will need to update them, and if those extensions are on [the official repository][official-repo], they will need to be resubmitted and reviewed.

### As an extension developer

Your extensions will need to be updated. See [this new page in the documentation](/ext-dev/migrating-api-levels).

### As another client mod developer

All of the libraries mentioned above can be used by your own code now. Have fun!

## The future of moonlight

moonlight, like the [PlayStation 5](https://en.wikipedia.org/wiki/Category:PlayStation_5-only_games), is pointless when there's nothing to install onto it. As with [last time](/blog/reintroducing-moonlight#whats-next-for-moonlight), we encourage developers to try making extensions. Let us know if there's anything we can improve, and submit your extension to [the official repository][official-repo] if you'd like.

We don't consider this a "moonlight 2.0" as much as "moonlight API version 2". There's no groundbreaking rewrite going on here, just some new libraries to play with.

[official-repo]: <https://github.com/moonlight-mod/extensions>
