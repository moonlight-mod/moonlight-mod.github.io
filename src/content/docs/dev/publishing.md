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

- Checkout the `develop` branch.
- Pull to ensure you have the latest changes.
- Checkout the `main` branch.
- Merge `develop` into `main`.
- Update the version in the following files:
  - `package.json`
  - `packages/browser/manifest.json`
  - `packages/browser/manifestv2.json`
- Write `CHANGELOG.md`.
  - Do not append to the changelog - remake it.
- If any types changes were made in this release, [update the types version](#publishing-types).
- Commit and push to `main`.
  - Make sure to push before creating the tag, or you might confuse CI (reasons unknown).
- Create a tag with the version, **starting with the character `v`**: `git tag vX.Y.Z`
  - This `v` is very important. CI will not pick it up otherwise. The installers will not know what to do without it.
- Push the tag: `git push --tags`
- Checkout the `develop` branch.
- Merge `main` into `develop`.
- Push to `develop`.

## Publishing types

- Update the version in `packages/types/package.json`.
  - We originally didn't have the types version in sync with moonlight, but we're aiming to resync. Bump the patch version until we can eventually re-synchronize them.
- Continue to publish a moonlight release like normal, and wait for CI to finish.
- [Run the types workflow](https://github.com/moonlight-mod/moonlight/actions/workflows/types.yml) to manually trigger a release to npm.
- In [the sample extension](https://github.com/moonlight-mod/sample-extension), update the types package: `pnpm update @moonlight-mod/types`
  - Remember to `git pull` and `pnpm i` beforehand so you are up to date.
- Commit and push to the sample extension.
- Update [create-extension](https://github.com/moonlight-mod/create-extension) following [these instructions](#publishing-other-libraries).
- If the manifest type was updated, regenerate the schema: `pnpx ts-json-schema-generator --path './packages/types/src/*.ts' --type ExtensionManifest -f ./tsconfig.json > ../moonlight-mod.github.io/public/manifest.schema.json`

## Publishing other libraries

(e.g. moonmap, LunAST, mappings, create-extension)

- Update package.json with a new version.
- Commit and push to `main`.
- Create a tag with the version, **starting with the character `v`**: `git tag vX.Y.Z`
  - Same reasoning as [above](#publishing-moonlight).
- Push the tag: `git push --tags`
- Wait for the package to be uploaded to npm.
- Use [the update helper script](/dev/helper-scripts) to update the dependencies in moonlight if needed.

## Publishing the installer

- Update `Cargo.toml`, `metainfo.xml`, and `assets/Info.plist` with a new version.
- Write a changelog into `metainfo.xml`.
- Commit and push to `main`.
- Wait for CI to finish and download the .exe/.dmg.
- Upload a new release, creating a tag in the GitHub UI **starting with the character `v`**, with the release description being the same as in `metainfo.xml`.
