---
title: Submitting to the official repository
description: While moonlight allows you to use custom repositories from URLs, it comes with an official repository built in.
sidebar:
  order: 2
---

While moonlight allows you to use custom repositories from URLs, it comes with an [official repository](https://github.com/moonlight-mod/extensions) built in. While submitting to the official repository is not required, it is highly encouraged.

Every extension on the official repository is reviewed and tested by the moonlight core team. All extension updates are also reviewed, but they will take less time than submitting a new extension.

## Requirements

We check for these when reviewing extensions:

- Your extension manifest should have a `version` set.
  - We suggest you stick to the major/minor/patch format seen in [SemVer](https://semver.org) (e.g. `1.0.0`).
  - You don't have to follow a specific guideline for how you bump the version, but you should use the same three-version format.
- Your extension manifest should have a detailed `meta` object. We encourage you to at least set `name`, `tagline`, `authors`, and `source`.
  - The `source` should link to the repository the extension is built from.

There are also some technical requirements for submitting your extension:

- Your extension must be on a Git repository available through HTTPS.
  - This isn't restricted to just GitHub, you can use any Git forge you'd like (including Gitea and Forgejo)!
  - Git over SSH is not supported.
- Your repository must use pnpm.
- Your repository must provide scripts to build and pack your extension into an .asar.
  - If you created your extension repository with `create-extension`, these are already setup for you.

Your extension may be [blocked for merge](#review-guidelines) if there are any changes required, or [denied](#repository-rules) if your extension violates the repository rules.

## Submitting a pull request

If this is your first time submitting to the official repository, [create a fork](https://github.com/moonlight-mod/extensions/fork) first. If you're new to forking on GitHub, see [here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) for more detailed instructions.

The easiest way to submit a pull request is via the GitHub web UI. Press the `.` key on your keyboard (or click the pencil icon when viewing a manifest) to start editing your fork. You can also clone your fork locally, if you prefer that.

In your fork, create a `.json` file in the `exts` folder, named after your extension's ID. Here's an example:

```json title="exts/platformStyles.json"
{
  "repository": "https://github.com/Cynosphere/moonlight-extensions.git",
  "commit": "df8a5d67809e5cb03f7d301dc8c65e3d1a79f9d9"
}
```

We call this a "build manifest" (to distinguish it from the extension manifest in your Git repository). Set `repository` to the URL of your Git repository, and set `commit` to the commit SHA that contains your extension. On GitHub, you can get the latest commit SHA by clicking the copy icon when viewing the commit in the web UI.

All you have to do is make the pull request, and we'll review and test it from there. If you need to make any changes, we'll let you know in the pull request comments. Otherwise, once the pull request is merged, your extension will be available for installation in Moonbase! If you're in [our Discord server](https://discord.gg/FdZBTFCP6F), let us know and we'll give you the "Extension Developer" role.

To update an extension, simply make another pull request, and update the `commit` in the build manifest. Make sure you increase the `version` in the extension manifest first!

## Adoption rules

To prevent extensions from going unmaintained on the official repository, an adoption policy is in place for other developers to take over ownership of an extension. You can adopt an extension in one of the following scenarios:

- You have written consent from a developer to adopt it
- The extension has been outdated for over 3 months, and the developer did not respond to contact after 7 days

An extension is defined as "outdated" when its features do not work, the extension crashes the client, or it has not been updated for the latest [API level](/ext-dev/migrating-api-levels). We encourage developers to reach out for permission in a public space, like GitHub issues or in the moonlight Discord server, so that the response can be verified.

## Repository rules

Extensions that violate the following rules cannot be submitted to the official repository:

- No automation ("selfbotting"). Interactions to the Discord API cannot be made without user interaction. Interactions with the Discord API must be possible by a human.
  - Examples: animated custom statuses, rainbow roles, scheduled messages, automatic message responses (like a bot would to a command), mass deleting messages
- Respect the privacy of other users. No logging of other users' actions or long-term scraping of the Discord API.
  - Examples: message loggers/"anti delete", message archival, read states via "hidden pixel" tracking
- Respect the privacy of the user. Interactions with third party services must be clearly denoted inside the extension tagline or description.
  - Examples: HTTP APIs, RPC calls to other processes on the user's machine

If you're unsure if your extension can be submitted or not, feel free to ask!

## Review guidelines

The extension review process is implemented for security reasons, but reviewers may also block an extension from merge if there's a very important problem. Reviewers should block merging on these kinds of issues:

- Invalid extension manifests (e.g. mismatched ID)
- Extension updates that haven't had a version bump
- Hardcoding unstable values (e.g. minified variables in a patch, Discord CSS classes, requiring direct module IDs)
- The extension manifest (or a Webpack module) is missing a declared dependency
- Conflicting extensions that aren't declared in the extension manifest
- Potential rule compliance issues
- Potential safety issues (e.g. very wide CSP/CORS settings)
- Updating unrelated files in the pull request (e.g. accidental formatting of other build manifests)

Reviewers should *not* block for these kinds of issues, as they do not impact the functionality of the extension, but they may want to comment on them:

- Badly written patches that are still functional (e.g. lots of lazy matching)
- Code that could be cleaned up (e.g. using `spacepack.require` instead of `import`)
- Code that could be rewritten to be more compatible (e.g. converting patches to a Flux listener)
- Remnants of the sample extension (e.g. unused loggers, leftover Node entrypoint)

Reviewers may want to leave a comment on their review when leaving extra feedback to give the extension author the opportunity to fix it. If the extension author doesn't want to fix it, the extension should still be merged.
