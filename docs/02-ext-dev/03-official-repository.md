# Submitting to the official repository

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

[extensions]: <https://github.com/moonlight-mod/extensions>
