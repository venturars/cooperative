# Contributing

## Issues and discussions

- **Bug reports**: open an issue on GitHub with steps to reproduce, expected vs actual behavior, and versions of `cooperative`, `wagmi`, and `viem` if relevant.
- **Feature ideas**: open an issue first so we can align on scope and API shape before you invest a large amount of work.
- **Security issues**: do not post exploitable details in public issues before a fix is available. Contact the maintainers through a **private** channel.

## Pull requests

1. **Fork** the repository and create a **branch** from `develop` (or the current default integration branch).
2. Keep changes **focused**: one concern per PR when possible.
3. **Describe** what changed and why in the PR description.
4. Ensure **`pnpm run typecheck`** (or `npm run typecheck`) passes at the package root. If you touch **`docs/`**, also run **`pnpm run docs:typecheck`**.
5. If you change public APIs or behavior, update **documentation** under `docs/` when it makes sense.

We review PRs when we can; smaller, well-scoped changes are easier to merge.

## Local development

From the repository root:

```bash
pnpm install
pnpm run build:dev    # or: pnpm run build
pnpm run typecheck
```

The SDK is TypeScript-only; there is no separate test runner in the default scripts today—relying on `typecheck` and manual verification in an app is the norm unless you add tests with your change.

### Documentation site

The Starlight site lives in `docs/`. From the repo root:

```bash
pnpm run docs:install
pnpm run docs:dev
pnpm run docs:typecheck
```

See `docs/README.md` for more detail.

## Commits

We use **[Conventional Commits](https://www.conventionalcommits.org/)** for changelog-friendly history. You do not need perfect commit messages for drive-by fixes, but prefixes like `fix:`, `feat:`, and `docs:` help maintainers and automation.

## Code style

- Match the existing layout, naming, and patterns.
- Prefer small, explicit changes over broad refactors in a single PR.
- Do not expand the public API without discussion unless the change is clearly a bugfix.

## License

By contributing, you agree that your contributions are licensed under the same license as the project (MIT).

---
