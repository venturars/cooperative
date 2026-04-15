---
title: Setup API
description: Configuration functions for the Cooperative SDK
---

Functions for configuring the SDK runtime.

## `configureSetup`

Configures the SDK with a chain client. Must be called once before using any other SDK functions.

### Parameters

```typescript
configureSetup(config: SetupConfig): void
```

#### `SetupConfig`

| Parameter     | Type                                            | Required | Description                          |
| ------------- | ----------------------------------------------- | -------- | ------------------------------------ |
| `chainClient` | `ChainClient`                                   | Yes      | Chain client for on-chain operations |
| `onError?`    | `(error: Error, context: ErrorContext) => void` | No       | Global error handler                 |

### Returns

`void`

### Example

```typescript
import { configureSetup, createWagmiChainClient } from "cooperative";
import { createConfig, http } from "wagmi";
import { mainnet } from "viem/chains";

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

configureSetup({
  chainClient: createWagmiChainClient(config),
  onError: (error, context) => {
    console.error(`Error in ${context.function}:`, error);
  },
});
```

### Errors

- **`Error: SDK is already configured`** - Called `configureSetup` multiple times
- **`Error: Invalid chain client`** - Provided chain client doesn't implement required interface

## `createWagmiChainClient`

Creates a chain client from a wagmi configuration.

### Parameters

```typescript
createWagmiChainClient(config: Config): ChainClient
```

#### `config`

A wagmi configuration object created with `createConfig`.

### Returns

`ChainClient` - Chain client implementation that can be passed to `configureSetup`.

### Example

```typescript
import { createWagmiChainClient } from "cooperative";
import { createConfig, http } from "wagmi";
import { mainnet } from "viem/chains";

const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const chainClient = createWagmiChainClient(wagmiConfig);
```

### Notes

- Requires `@wagmi/core` as a peer dependency
- The wagmi config must include all chains you plan to use

## `createCooperativeConfig`

Creates a wagmi configuration optimized for Cooperative SDK.

### Parameters

```typescript
createCooperativeConfig(options?: CooperativeConfigOptions): Config
```

#### `CooperativeConfigOptions`

| Parameter    | Type                        | Required | Description                                        |
| ------------ | --------------------------- | -------- | -------------------------------------------------- |
| `chains`     | `Chain[]`                   | No       | Array of chains (default: Ethereum, Polygon, Base) |
| `transports` | `Record<number, Transport>` | No       | Transport configuration per chain                  |
| `ssr?`       | `boolean`                   | No       | Enable SSR support (default: false)                |

### Returns

`Config` - A wagmi configuration object.

### Example

```typescript
import { createCooperativeConfig } from "cooperative";
import { http } from "wagmi";

const config = createCooperativeConfig({
  transports: {
    1: http("https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY"),
    137: http("https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY"),
    8453: http("https://base-mainnet.g.alchemy.com/v2/YOUR_KEY"),
  },
});
```

### Default Chains

If no chains are provided, defaults to:

- Ethereum (1)
- Polygon (137)
- Base (8453)
