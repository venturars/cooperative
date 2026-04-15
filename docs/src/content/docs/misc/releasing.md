---
title: Releasing
description: How to release new versions of the Cooperative SDK
---

# Releasing

This guide explains the release process for the Cooperative SDK.

## Overview

When code is pushed to the `main` branch, GitHub Actions automatically:

1. **Reads the version** from `package.json`
2. **Checks if it changed** from the last release
3. **Builds the package**
4. **Generates a changelog** from commit messages
5. **Creates a GitHub release** with the tag `vX.Y.Z`

## Release Workflow

### 1. Update Version

Before merging to `main`, update the version in `package.json`:

```json
{
  "version": "0.1.1"  // Update this
}
```

**Version bump rules:**
- `feat:` commits → bump MINOR version (0.1.0 → 0.2.0)
- `fix:` commits → bump PATCH version (0.1.0 → 0.1.1)
- Breaking changes → bump MAJOR version (0.1.0 → 1.0.0)

### 2. Merge to Main

```bash
# Ensure you're on develop branch
git checkout develop

# Update with latest changes
git pull origin develop

# Merge to main
git checkout main
git merge develop
git push origin main
```

### 3. Verify Release

Check the [GitHub Releases](https://github.com/venturars/cooperative/releases) page:

- ✅ Tag matches package.json version (e.g., `v0.1.1`)
- ✅ Changelog is accurate
- ✅ Release is published

## Commit Message Convention

Use conventional commits for automatic changelog generation:

### Feature (bumps MINOR version)
```
feat: add new swap validation function
feat(api): improve error messages
```

### Fix (bumps PATCH version)
```
fix: handle edge case in balance calculation
fix(swaps): correct gas estimation
```

### Documentation
```
docs: update API reference
docs: fix typo in README
```

### Maintenance
```
chore: update dependencies
chore: improve build configuration
```

### Breaking Changes (bumps MAJOR version)
```
feat!: remove deprecated API
feat(api): change response format

BREAKING CHANGE: Response format changed from array to object
```

## Manual Release

If you need to trigger a release manually:

1. Go to [Actions tab](https://github.com/venturars/cooperative/actions)
2. Select "Release" workflow
3. Click "Run workflow"
4. Select "main" branch
5. Click "Run workflow"

## Troubleshooting

### Tag Doesn't Match package.json

**Problem**: GitHub created tag `v0.1.2` but `package.json` says `0.1.1`

**Solution**:
1. Delete the incorrect tag:
   ```bash
   git tag -d v0.1.2
   git push origin :refs/tags/v0.1.2
   ```
2. Update `package.json` to correct version
3. Push to `main` again

### Release Not Created

**Problem**: Pushed to `main` but no release was created

**Check**:
1. Go to [Actions](https://github.com/venturars/cooperative/actions)
2. Find the "Release" workflow run
3. Check logs for errors
4. Verify `package.json` version changed from last tag

### Changelog Missing Commits

**Problem**: Some commits don't appear in the release notes

**Solution**: Ensure commits follow the conventional commit format

## Release Checklist

### Before Merging to Main
- [ ] Update version in `package.json`
- [ ] Run tests: `pnpm test`
- [ ] Build package: `pnpm build`
- [ ] Update documentation if needed
- [ ] Verify commit messages follow convention

### After Release
- [ ] Verify tag created: `vX.Y.Z`
- [ ] Check release notes on GitHub
- [ ] Test published package: `pnpm add cooperative@X.Y.Z`

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | Initial release | Basic swap and balance functionality |

## Related Resources

- [GitHub Workflow](https://github.com/venturars/cooperative/blob/main/.github/workflows/release.yml)
- [RELEASING.md](https://github.com/venturars/cooperative/blob/main/RELEASING.md) (detailed technical guide)
- [Contributing Guide](/misc/contributing/) (development workflow)