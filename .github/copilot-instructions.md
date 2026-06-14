# GitHub Copilot Instructions

A JavaScript GitHub Action that compares the version in `package.json` (or a specified
source) against the repo's Git tags and outputs the new version or `"no changes"`.

This file intentionally avoids restating facts that already live in the code — those drift.
For runtime, dependencies, license, and inputs/outputs, read `package.json` and `action.yml`.
For code style, follow `eslint.config.js` (run `npm run lint`); do not infer style from
surrounding code if it disagrees with the linter.

## The non-obvious bits

- **Source lives in `src/index.js`** (not the repo root). Edit it, never the built output.
- **`action/index.js` is the built bundle** (`npm run build`, via `@vercel/ncc`). It is
  generated, but it **is committed** — consumers run it directly from the tag.
- **Build locally and commit the bundle as part of your version bump.** The `version` npm
  hook (`npm run build && git add action`) does this automatically when you run
  `npm run patch` / `minor` / `major`.
- **Releasing does not build for you.** On PR merge, the Release workflow rebuilds and
  *verifies* the committed `action/` matches the source — a stale bundle fails the release.
  CI never commits to `main`.
- **Prefer `@gesslar/toolkit` helpers** (e.g. `Sass`, `Data`) over hand-rolled equivalents,
  matching the existing source.
