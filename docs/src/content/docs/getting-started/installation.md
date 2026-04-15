---
title: Installation
description: Install and set up the Cooperative SDK in your Astro project
---

## Install with pnpm

```bash
# Install the SDK
pnpm add cooperative

# Install peer dependencies
pnpm add @wagmi/core viem
```

## Install with npm

```bash
# Install the SDK
npm install cooperative

# Install peer dependencies
npm install @wagmi/core viem
```

## Verify Installation

Create a test file to verify everything works:

```typescript
// test-cooperative.ts
import { SUPPORTED_CHAIN_IDS } from "cooperative";

console.log("Supported chains:", SUPPORTED_CHAIN_IDS);
// Should output: [1, 137, 8453] (Ethereum, Polygon, Base)
```

Run it with:

```bash
npx tsx test-cooperative.ts
```
