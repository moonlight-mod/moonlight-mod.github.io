# Submitting to the official repository

While moonlight allows you to use custom repositories from URLs, it comes with an [official repository][extensions] built in. While submitting to the official repository is not required, it is highly suggested.

## Submitting a pull request

First, you must have a `.asar` file containing the `manifest.json` and entrypoints. The [sample extension](/docs/ext-dev/getting-started) automatically builds this, so if you use it, it is suggested to simply download and commit the built file from GitHub Pages.

The manifest must contain an `id`, `version`, and `meta.source`. The ID and version can be any unique string, and the source must be a URL to the repository where your code is located in. Then, create a pull request to [the official repository][extensions] with the `.asar` in the `exts/` folder. After merge, it will automatically show up for all moonlight users.

[extensions]: <https://github.com/moonlight-mod/extensions>
