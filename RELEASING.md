# Releasing (maintainers)

## Branch flow

- Day-to-day work happens on **`develop`**.
- Merge **`develop` → `main`** via pull request to trigger a release.
- A GitHub Action creates a new **version tag** on merges to `main`.

## Commit messages and version bumps

Commits follow [Conventional Commits](https://www.conventionalcommits.org/). CI uses commit messages to infer the semver bump:

| Commit prefix                                   | Version bump      | Example                          |
| ----------------------------------------------- | ----------------- | -------------------------------- |
| `BREAKING CHANGE` or `feat!:`                   | **major** (x.0.0) | `feat!: remove configureSetup`   |
| `feat:`                                         | **minor** (0.x.0) | `feat: add retrieveNFTs`         |
| `fix:`, `chore:`, `docs:`, `refactor:`, `perf:` | **patch** (0.0.x) | `fix: handle null token address` |

## Consuming a tag from GitHub in an app

After a tag exists (e.g. `v1.2.0`), pin it in `package.json`:

```json
"cooperative": "github:venturars/cooperative#v1.2.0"
```

Then install:

```bash
pnpm install
```

To upgrade, bump the tag in `package.json` and reinstall.
