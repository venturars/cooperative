---
title: Configuration
description: Configure the Cooperative SDK with wagmi, RPC endpoints, and supported chains in an Astro app
---

## Basic setup

In an Astro app, run `configureSetup` once by putting the wagmi + SDK wiring in a small module and importing that module from your root layout (side-effect import). The wagmi config must list every chain you use and define a [transport](https://wagmi.sh/core/api/transports) per chain (for example `http()` for defaults, or `http(url)` for your own RPC).

**`src/lib/cooperative.ts`**

```typescript
import { configureSetup, createWagmiChainClient } from "cooperative";
import { createConfig, http } from "wagmi";
import { mainnet, polygon, base } from "viem/chains";

const wagmiConfig = createConfig({
  chains: [mainnet, polygon, base],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
  },
});

configureSetup({
  chainClient: createWagmiChainClient(wagmiConfig),
});
```

## Custom RPC URLs

For production, point each chain at a provider you control (Alchemy, Infura, and so on) so you avoid public RPC rate limits and get more predictable behavior.

Add [environment variables](https://docs.astro.build/en/guides/environment-variables/) at the **project root** in `.env`. Prefix names with `PUBLIC_` when the value must be available in code that Astro ships to the client (typical for wagmi and wallet flows):

```bash
# .env.local
PUBLIC_ETH_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your_key
PUBLIC_POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/your_key
PUBLIC_BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/your_key
```

**`src/lib/cooperative.ts`**

```typescript
import { configureSetup, createWagmiChainClient } from "cooperative";
import { createConfig, http } from "wagmi";
import { mainnet, polygon, base } from "viem/chains";

const wagmiConfig = createConfig({
  chains: [mainnet, polygon, base],
  transports: {
    [mainnet.id]: http(import.meta.env.PUBLIC_ETH_RPC_URL),
    [polygon.id]: http(import.meta.env.PUBLIC_POLYGON_RPC_URL),
    [base.id]: http(import.meta.env.PUBLIC_BASE_RPC_URL),
  },
});

configureSetup({
  chainClient: createWagmiChainClient(wagmiConfig),
});
```

## Supported chains

| Chain ID | Name     | Native token |
| -------- | -------- | ------------ |
| 1        | Ethereum | ETH          |
| 137      | Polygon  | POL          |
| 8453     | Base     | ETH          |
