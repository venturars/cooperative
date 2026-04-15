# Release Process

This document explains how to release new versions of the Cooperative SDK.

## Versioning Strategy

We use [Semantic Versioning](https://semver.org/):

- **MAJOR** version (X.0.0): Breaking changes
- **MINOR** version (0.X.0): New features (backward compatible)
- **PATCH** version (0.0.X): Bug fixes (backward compatible)

## Release Workflow

### 1. Update Version Automatically

Use the automatic version bump script:

```bash
# From repository root
pnpm run version:bump

# Or dry run first to see what would happen
pnpm run version:dry-run
```

The script:

1. Analyzes commits since last tag
2. Determines bump type based on commit messages
3. Updates `package.json` automatically

**Version bump rules:**

- `feat:` commits → bump MINOR version (0.1.0 → 0.2.0)
- `fix:` commits → bump PATCH version (0.1.0 → 0.1.1)
- Breaking changes → bump MAJOR version (0.1.0 → 1.0.0)
- `docs:`, `chore:`, etc. → No automatic bump

### Manual Version Update (Alternative)

If you prefer to set the version manually:

```json
{
  "version": "0.1.1" // Update this
}
```

### 2. Merge to Main

Merge your changes from `develop` to `main`:

```bash
# From develop branch
git checkout main
git merge develop
git push origin main
```

### 3. Automated Release

When code is pushed to `main`, GitHub Actions will:

1. **Read version** from `package.json`
2. **Check if changed** from last tag
3. **Build the package**
4. **Generate changelog** from commits
5. **Create GitHub release** with tag `vX.Y.Z`

### 4. Verify Release

Check the [GitHub Releases](https://github.com/venturars/cooperative/releases) page to verify:

- ✅ Tag matches package.json version
- ✅ Changelog is accurate
- ✅ Release is published
