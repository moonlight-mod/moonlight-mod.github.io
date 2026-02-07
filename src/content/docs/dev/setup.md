---
title: Project setup
description: Information on moonlight's project structure and build system
sidebar:
  order: 1
---

moonlight requires [Node.js](https://nodejs.org) 22 and [pnpm](https://pnpm.io) 10.

- Clone the repository: `git clone https://github.com/moonlight-mod/moonlight.git`
- Install dependencies: `pnpm install`.
- Build the project: `pnpm run build`.
  - For working on moonlight, a watch mode is available with `pnpm run dev`. Remember that you must [restart the command in some scenarios](/ext-dev/pitfalls#restarting-dev-mode-is-required-in-some-scenarios).

For more information on project structure, [see the dedicated page](/dev/project-structure).

## Contribution guidelines

- Ensure your commits pass Prettier/ESLint. This is a requirement for merge.
  - moonlight uses [husky](https://typicode.github.io/husky) to check lints on commit. This should have automatically been setup for you when running `pnpm install`.
- Don't break the existing API surface.
  - Library extensions and moonlight globals cannot change in a way that breaks existing extensions (unless there is an upcoming API bump).
