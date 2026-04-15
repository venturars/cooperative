# Release Process

This document explains how to release new versions of the Cooperative SDK.

## Versioning Strategy

We use [Semantic Versioning](https://semver.org/):
- **MAJOR** version (X.0.0): Breaking changes
- **MINOR** version (0.X.0): New features (backward compatible)
- **PATCH** version (0.0.X): Bug fixes (backward compatible)

## Release Workflow

### 1. Update Version in `package.json`

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

## Commit Message Convention

Use conventional commits for automatic changelog generation:

```
feat: add new swap validation function
fix: handle edge case in balance calculation
docs: update API reference
chore: update dependencies
```

**Breaking changes** must be marked:
```
feat!: remove deprecated API
feat(api): change response format

BREAKING CHANGE: Response format changed from array to object
```

## Manual Release (If Needed)

If you need to trigger a release manually:

1. Go to [Actions tab](https://github.com/venturars/cooperative/actions)
2. Select "Release" workflow
3. Click "Run workflow"
4. Select "main" branch
5. Click "Run workflow"

## Troubleshooting

### Tag and package.json mismatch
**Problem**: Tag version doesn't match `package.json` version
**Solution**: 
1. Check that `package.json` version is updated before merging to main
2. Delete incorrect tag: `git tag -d vX.Y.Z && git push origin :refs/tags/vX.Y.Z`
3. Update `package.json` and push to main again

### Release not created
**Problem**: Push to main but no release created
**Solution**:
1. Check workflow runs in GitHub Actions
2. Verify `package.json` version changed from last tag
3. Check workflow logs for errors

### Changelog missing commits
**Problem**: Some commits not in changelog
**Solution**: Use conventional commit format for all commits

## Release Checklist

Before merging to main:

- [ ] Update version in `package.json`
- [ ] Run tests: `pnpm test`
- [ ] Build package: `pnpm build`
- [ ] Update documentation if needed
- [ ] Verify commit messages follow convention

After release:

- [ ] Verify tag created: `vX.Y.Z`
- [ ] Check release notes on GitHub
- [ ] Test published package: `pnpm add cooperative@X.Y.Z`

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | Initial release | Basic swap and balance functionality |
| ... | ... | ... |

## Related Documents

- [Contributing Guide](./CONTRIBUTING.md)
- [GitHub Workflow](./.github/workflows/release.yml)
- [Package.json](./package.json)