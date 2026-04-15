---
title: Releasing
description: Maintainer workflow for merging to main, semver bumps from commits, and pinning releases in applications
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 2
---

Release mechanics and maintainer expectations are documented in the repository’s **<a href="https://github.com/venturars/cooperative/blob/main/RELEASING.md" target="_blank" rel="noopener noreferrer">Releasing guide</a>**. This page summarizes that workflow; refer to the linked document for the canonical version.

## Branch flow

- Day-to-day work happens on **`develop`**.
- Merge **`develop` → `main`** via pull request to trigger a release.
- A GitHub Action creates a new **version tag** on merges to `main`.

## Commit messages and version bumps

Commits follow <a href="https://www.conventionalcommits.org/" target="_blank" rel="noopener noreferrer">Conventional Commits</a>. CI uses commit messages to infer the semver bump:

| Commit prefix                                   | Version bump      | Example                          |
| ----------------------------------------------- | ----------------- | -------------------------------- |
| `BREAKING CHANGE` or `feat!:`                   | **major** (x.0.0) | `feat!: remove configureSetup`   |
| `feat:`                                         | **minor** (0.x.0) | `feat: add retrieveNFTs`         |
| `fix:`, `chore:`, `docs:`, `refactor:`, `perf:` | **patch** (0.0.x) | `fix: handle null token address` |

## Consuming a tag from GitHub in an app

After a tag exists (for example `v1.2.0`), pin it in `package.json`:

```json
"cooperative": "github:venturars/cooperative#v1.2.0"
```

Then install:

```bash
pnpm install
```

To upgrade, bump the tag in `package.json` and reinstall. Further detail is in <a href="https://github.com/venturars/cooperative/blob/main/RELEASING.md" target="_blank" rel="noopener noreferrer"><code>RELEASING.md</code></a>.
