---
title: Cooperative SDK
description: TypeScript SDK for building DeFi applications
template: splash
---

# Cooperative SDK

Build DeFi applications faster with our TypeScript SDK. Get token swaps, balance aggregation, and chain utilities out of the box.

## Quick Start

```bash
# Install with pnpm
pnpm add cooperative

# Peer dependencies
pnpm add @wagmi/core viem
```

```typescript
// Basic setup
import { configureSetup, createWagmiChainClient } from 'cooperative';
import { createConfig, http } from 'wagmi';
import { mainnet } from 'viem/chains';

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

configureSetup({
  chainClient: createWagmiChainClient(config),
});
```

## Features

- **Token Swaps**: 0x Protocol integration with price validation
- **Balance Aggregation**: Unified balance views across chains
- **Token Discovery**: Find tokens from Uniswap and Blockscout
- **Chain Support**: Ethereum, Polygon, and Base
- **Type Safe**: Full TypeScript support

## Documentation

### 🚀 [Getting Started](/getting-started/installation/)
Learn how to install and configure the SDK.

### 📚 [API Reference](/api-reference/setup/)
Complete reference for all functions, parameters, and return types.

### 🔧 [Miscellaneous](/misc/contributing/)
Contributing guidelines, release process, and license.

## Examples

### Get a Swap Quote
```typescript
import { getQuote } from 'cooperative';

const quote = await getQuote({
  takerAddress: '0x...',
  chainId: 1,
  tokenIn: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH
  tokenOut: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  sellAmount: 1000000000000000000n, // 1 ETH
});
```

### Check Token Balances
```typescript
import { retrieveTokensWithBalance } from 'cooperative';

const tokens = await retrieveTokensWithBalance({
  chainId: 1,
  address: '0x...',
});
```

## Need Help?

- Check the [Common Issues](/misc/contributing/#common-issues)
- Review the [API Reference](/api-reference/setup/) for specific functions
- See [Contributing](/misc/contributing/) for development guidelines