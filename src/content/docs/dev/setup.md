---
title: Project setup
description: Information on moonlight's project structure and build system
sidebar:
  order: 1
---


You will need [pnpm](https://pnpm.io) 10, as moonlight uses it for dependency and workspace management.

- Clone the repository.
- Install dependencies with `pnpm i`.
- Build the project with `pnpm run build`.
  - For working on moonlight, a watch mode is available with `pnpm run dev`.

For more information on project structure, [see the dedicated page](/dev/project-structure).

## Contribution guidelines

- Ensure your commits pass Prettier/ESLint. This is a requirement for merge.
  - moonlight uses [husky](https://typicode.github.io/husky/) to check lints on commit.
- Please make PRs to the `develop` branch instead of `main`.
  - `develop` is merged into `main` when moonlight updates happen. Our in-progress work resides on `develop`.
- Don't break the existing API surface.
  - Library extensions and moonlight globals cannot change in a way that breaks existing extensions (unless there is an upcoming API bump).
