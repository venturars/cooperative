---
title: Contributing
description: Local development workflow for the SDK and documentation, with links to the full contributing policy
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 2
---

The Cooperative project welcomes contributions. This page describes how to install dependencies and run the project locally. Policies for issues, pull requests, commit conventions, and code style are maintained in the repository’s **<a href="https://github.com/venturars/cooperative/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">Contributing guide</a>**; please read that document before opening substantial work.

## Working on the SDK

After cloning the repository, work from the **repository root** and use the following commands as needed:

```bash
pnpm install
pnpm dev              # watch build
pnpm run typecheck
pnpm run build:dev      # dev build (localhost API)
```

Run `pnpm run build` when you require a production-oriented build. Additional context and expectations for SDK changes are covered in <a href="https://github.com/venturars/cooperative/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer"><code>CONTRIBUTING.md</code></a>.

## Working on the documentation

The documentation site is implemented under `docs/`. From the **repository root**, the recommended workflow uses the scripts defined in the root `package.json`:

```bash
pnpm run docs:install
pnpm run docs:dev       # http://localhost:4321
pnpm run docs:typecheck
pnpm run docs:build     # optional: full build check
```

Alternatively, you may install and run commands directly inside the `docs/` directory (`pnpm install`, `pnpm dev`, `pnpm run build`). For extended instructions, refer to <a href="https://github.com/venturars/cooperative/blob/main/docs/README.md" target="_blank" rel="noopener noreferrer"><code>docs/README.md</code></a> in the repository.

## Pull Request Process

### 1. Before creating a pull request

From the **repository root**, run the checks that apply to your change. SDK work should pass typecheck and build; documentation work should pass the docs checks (and typecheck at the root if you touched shared expectations described in <a href="https://github.com/venturars/cooperative/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer"><code>CONTRIBUTING.md</code></a>).

```bash
# SDK-related changes
pnpm typecheck
pnpm build

# Documentation changes (and whenever you edit files under docs/)
pnpm run docs:typecheck
pnpm run docs:build
```

### 2. Branch strategy

- **Integration branch**: `develop` — open pull requests **against** `develop`.
- **Source branch**: create your branch **from** `develop` after it is up to date.
- **Naming** (examples):
  - `feat/feature-name` — new functionality
  - `fix/bug-description` — bug fixes
  - `docs/topic` — documentation only
  - `chore/task-description` — maintenance

### 3. Opening and describing the pull request

Push your branch to your fork or to the remote you use for collaboration, then open a pull request targeting **`develop`**. Summarize **what** changed, **why** and **how you verified** it. Prefer **focused** changes (one coherent goal per pull request when practical) so review stays efficient.

### 4. Review

Maintainers will review when available. Update the branch if requested, reply to review comments, and keep the pull request description accurate if the scope shifts.
