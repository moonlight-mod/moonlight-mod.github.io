---
title: Publishing a new release
sidebar:
  order: 3
---

:::note
This page is mainly here for moonlight core developers who forget what they're doing. Normal users and contributors PRing do not have to do anything here.
:::

:::caution
Version bumps are not done until a publish is required. Make sure to version bump moonlight (and types, if necessary) before publishing.

When publishing to npm, versions are constant. Exercise caution.
:::

## Publishing moonlight

moonlight CI builds the `develop` branch automatically. This section is for publishing a new stable, versioned release.

- Checkout the `main` branch.
- Merge `develop` into `main`.
- Update the version (in `package.json` and the browser manifests) and write `CHANGELOG.md`.
  - Do not append to the changelog - remake it.
- If any types changes were made in this release, [publish the types](#publishing-types).
- Commit and push to `main`.
- Create a tag with the version, **starting with the character `v`**: `git tag vX.Y.Z`
  - This `v` is very important. CI will not pick it up otherwise. The installers will not know what to do without it.
- Push the tag: `git push --tags`
- Checkout the `develop` branch.
- Merge `main` into `develop`.
- Push to `develop`.

## Publishing types

- Update the version in `packages/types/package.json`.
  - The version of types does not need to be in sync with the version of moonlight.
- Commit and push to `main`.
  - If releasing a stable build of moonlight, make sure the main version bump and types version bump are in the same commit.
- Publish the package: `pnpm publish --access public`
  - Publish from within the `packages/types` directory.
- In [the sample extension](https://github.com/moonlight-mod/sample-extension), update the types package: `pnpm update @moonlight-mod/types`
- Commit and push to the sample extension.

## Publishing LunAST/moonmap/mappings

- Update package.json with a new version.
- Commit and push to `main`.
- Create a tag with the version, **starting with the character `v`**: `git tag vX.Y.Z`
  - Same reasoning as [above](#publishing-moonlight).
- Push the tag: `git push --tags`
- Wait for the package to be uploaded to npm.
- Use [the update helper script](/dev/helper-scripts) to update the dependencies in moonlight.
