---
title: Submitting to the official repository
description: While moonlight allows you to use custom repositories from URLs, it comes with an official repository built in.
sidebar:
  order: 2
---

While moonlight allows you to use custom repositories from URLs, it comes with an [official repository][extensions] built in. While submitting to the official repository is not required, it is highly suggested.

## Submitting a pull request

There are some requirements for submission:

- Your extension must be open source on a Git repository.
- Your extension must use pnpm.
- Your extension manifest must contain an `id`, `version`, and `meta.source`. The ID and version can be any unique string, and the source must be a URL to the repository where your code is located in.

Then, create a pull request to [the official repository][extensions], adding a manifest. A manifest is a JSON object that looks like this:

```json
{
  "repository": "https://github.com/Cynosphere/moonlight-extensions.git",
  "commit": "accf381859ca72eb624abc9ce04ec30c21982a87",
  "scripts": ["build", "repo"],
  "artifact": "repo/platformStyles.asar"
}
```

`repository` must be a valid HTTPS Git URL. `commit` must be a valid commit in that repository. `scripts` is an array of pnpm scripts to build your project - for repositories using the sample extension, this will be `build` and `repo`. `artifact` is the location of the output file - for repositories using the sample extension, this will be `repo/<extension id>.asar`.

## Adoption rules

To prevent extensions from going unmaintained on the official repository, an adoption policy is in place for other developers to take over ownership of an extension. You can adopt an extension in one of the following scenarios:

- You have written consent from a developer to adopt it
- The extension has been outdated for over 3 months, and the developer did not respond after contact after 7 days

An extension is defined as "outdated" when its features do not work, the extension crashes the client, or it has not been updated for the latest [API level](/ext-dev/migrating-api-levels/). We encourage developers to reach out for permission in a public space, like GitHub issues or in the moonlight Discord server, so that the response can be verified.

[extensions]: <https://github.com/moonlight-mod/extensions>
