---
title: Versioning
description: Automatic version bump script and semantic versioning
---

# Versioning

The Cooperative SDK uses **Semantic Versioning** (SemVer) and includes an automatic version bump script that analyzes commit messages to determine the next version.

## Automatic Version Bumping

### Using the Script

```bash
# From repository root
pnpm run version:bump      # Bump version based on commits
pnpm run version:dry-run   # Show what would happen (dry run)

# Or directly
node scripts/bump-version.js
node scripts/bump-version.js --dry-run
node scripts/bump-version.js --version 0.2.0
```

### What the Script Does

1. **Analyzes commits** since the last tag
2. **Determines bump type** based on commit messages:
   - `feat:` → MINOR bump (0.1.0 → 0.2.0)
   - `fix:` → PATCH bump (0.1.0 → 0.1.1)
   - Breaking changes → MAJOR bump (0.1.0 → 1.0.0)
3. **Updates `package.json`** with new version
4. **Shows analysis** of commits and version decision

### Example Output

```
🚀 Cooperative SDK - Version Bump Script

📊 Commit Analysis:
Latest tag: v0.1.0
Commits since tag: 5

📈 Breakdown:
  Features: 2
  Fixes: 1
  Documentation: 1
  Maintenance: 1

📝 Recent commits:
  1. feat: add new swap validation
  2. fix: handle edge case in balances
  3. docs: update API reference
  4. chore: update dependencies
  5. feat: improve error messages

🎯 Version Decision:
   Current: 0.1.0
   Bump type: minor
   Next: 0.2.0

✅ Updated:
   package.json: 0.1.0 → 0.2.0

📋 Next steps:
   1. Commit the version change:
      git add package.json
      git commit -m "chore: bump version to 0.2.0"
   
   2. Merge to main for release:
      git checkout main
      git merge develop
      git push origin main
   
   3. GitHub Actions will create release v0.2.0
```

## Commit Message Convention

For the script to work correctly, use conventional commit messages:

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

### Breaking Change (bumps MAJOR version)
```
feat!: remove deprecated API
feat(api): change response format

BREAKING CHANGE: Response format changed from array to object
```

### Documentation & Maintenance (no automatic bump)
```
docs: update API reference
chore: update dependencies
refactor: improve code structure
style: fix formatting
test: add unit tests
```

## Manual Version Override

If you need to set a specific version:

```bash
node scripts/bump-version.js --version 1.0.0
```

## Release Workflow with Script

### Complete Release Process

```bash
# 1. Run tests and build
pnpm test
pnpm build

# 2. Bump version automatically
pnpm run version:bump

# 3. Commit version change
git add package.json
git commit -m "chore: bump version to X.Y.Z"

# 4. Merge to main
git checkout main
git merge develop
git push origin main

# 5. GitHub Actions creates release vX.Y.Z
```

### Quick Release Command

Create a release script in your shell:

```bash
# Add to ~/.zshrc or ~/.bashrc
release-cooperative() {
  echo "🚀 Starting release process..."
  
  # Run tests
  pnpm test || { echo "❌ Tests failed"; return 1; }
  
  # Build package
  pnpm build || { echo "❌ Build failed"; return 1; }
  
  # Bump version
  pnpm run version:bump || { echo "❌ Version bump failed"; return 1; }
  
  # Get new version
  NEW_VERSION=$(node -p "require('./package.json').version")
  
  echo "✅ Ready to release v$NEW_VERSION"
  echo "📋 Next: git add package.json && git commit -m 'chore: bump version to $NEW_VERSION'"
}
```

## Troubleshooting

### Script Doesn't Detect Changes

**Problem**: Script says "No version bump needed" but there are changes.

**Check**:
1. Are commits using conventional format? (`feat:`, `fix:`, etc.)
2. Is there a recent tag? Run `git tag --sort=-v:refname`
3. Are you on the correct branch? (should be `develop`)

### Wrong Bump Type

**Problem**: Script suggests MINOR but you want PATCH.

**Solution**:
```bash
# Override with specific version
node scripts/bump-version.js --version 0.1.1
```

### No Tags Found

**Problem**: Script says "No tags found".

**Solution**:
- First release: Use `--version 0.1.0`
- Or create initial tag: `git tag v0.1.0 && git push origin v0.1.0`

## Integration with CI/CD

The version bump script is designed to be run locally before merging to `main`. GitHub Actions will then:

1. Read the version from `package.json`
2. Create tag `vX.Y.Z`
3. Generate changelog from commits
4. Publish GitHub release

## Related

- [Releasing](/misc/releasing/) - Complete release process
- [Contributing](/misc/contributing/) - Development workflow
- [Semantic Versioning](https://semver.org/) - Official specification