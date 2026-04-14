# Contributing

## Workflow

- Work on `develop` branch
- Merge `develop` → `main` via PR to trigger a release
- A GitHub Action automatically creates a new version tag on every merge to `main`

## Commit Convention

Commits follow [Conventional Commits](https://www.conventionalcommits.org/). The CI reads commit messages to determine the version bump:

| Commit prefix | Version bump | Example |
|---------------|-------------|---------|
| `BREAKING CHANGE` or `feat!:` | **major** (x.0.0) | `feat!: remove configureSetup` |
| `feat:` | **minor** (0.x.0) | `feat: add retrieveNFTs` |
| `fix:`, `chore:`, `docs:`, `refactor:`, `perf:` | **patch** (0.0.x) | `fix: handle null token address` |

## Using the Package in Apps

Once a tag is created (e.g. `v1.2.0`), use it in your app's `package.json`:

```json
"cooperative": "github:venturars/cooperative#v1.2.0"
```

Then install:
```bash
npm install
# or
pnpm install
```

To update to a newer tag, bump the version in `package.json` and reinstall.
