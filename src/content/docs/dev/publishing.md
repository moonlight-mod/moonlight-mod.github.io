---
title: Publishing a new release
sidebar:
  order: 4
---

:::note
This page is mainly here for moonlight core developers who forget what they're doing. Normal users and contributors PRing do not have to do anything here.
:::

:::caution
Version bumps are not done until a publish is required. When publishing to npm, versions are constant. Exercise caution.
:::

## Publishing moonlight

moonlight CI builds the `main` branch automatically. This section is for publishing a new stable, versioned release.

- Checkout the `main` branch.
- Pull to ensure you have the latest changes.
- Run `node scripts/version.mjs` to update the project version.
  - If there were no changes to types or mappings, you can technically undo the version bump, though it's suggested to just leave it there out of caution. If there were any changes to mappings, types must always be updated to sync alongside it.
- Write `CHANGELOG.md`. Do not append to the changelog - remake it.
- Commit and push to `main`.
  - Make sure to push before creating the tag, or you might confuse CI.
- Create a tag with the new version, **starting with the character `v`**: `git tag vX.Y.Z`
  - This `v` is very important. CI will not pick it up otherwise. The installers will not know what to do without it.
  - Double triple check that you didn't mistype the version number (this has happened before).
- Push the tag: `git push --tags`

Packages will be published to npm alongside the GitHub release. If the extension manifest type was updated, regenerate the JSON Schema: `pnpx ts-json-schema-generator --path './packages/types/src/*.ts' --type ExtensionManifest -f ./tsconfig.json > ../moonlight-mod.github.io/public/manifest.schema.json`

## Publishing other libraries

(e.g. moonmap, LunAST, create-extension)

- Update package.json with a new version.
- Commit and push to `main`.
- Create a tag with the version, **starting with the character `v`**: `git tag vX.Y.Z`
  - Same reasoning as [above](#publishing-moonlight).
- Push the tag: `git push --tags`
- Wait for the package to be uploaded to npm.
- Update the dependencies in moonlight.

## Publishing the installer

- Update `Cargo.toml`, `metainfo.xml`, and `assets/Info.plist` with a new version.
- Write a changelog into `metainfo.xml`.
- Commit and push to `main`.
- Wait for CI to finish and download the .exe/.dmg.
- Upload a new release, creating a tag in the GitHub UI **starting with the character `v`**, with the release description being the same as in `metainfo.xml`.
