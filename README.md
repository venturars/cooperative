# Cooperative SDK

TypeScript SDK for building DeFi applications with token swaps, balances, and on-chain utilities.

## Installation

```bash
pnpm add cooperative
pnpm add @wagmi/core viem
```

## Quick Start

```typescript
import { configureSetup, createWagmiChainClient } from 'cooperative';
import { createConfig, http } from 'wagmi';
import { mainnet } from 'viem/chains';

// Configure once
const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

configureSetup({
  chainClient: createWagmiChainClient(config),
});

// Use SDK functions
import { getQuote } from 'cooperative';

const quote = await getQuote({
  takerAddress: '0x...',
  chainId: 1,
  tokenIn: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH
  tokenOut: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  sellAmount: 1000000000000000000n, // 1 ETH
});
```

## Features

- **Token Swaps**: 0x Protocol integration
- **Balance Aggregation**: Unified balance views
- **Token Discovery**: Find tokens from Uniswap and Blockscout
- **Chain Support**: Ethereum, Polygon, Base
- **Type Safe**: Full TypeScript support

## Documentation

Full documentation available at: [https://docs.cooperative.finance](https://docs.cooperative.finance)

### Local Development
```bash
cd docs
pnpm install
pnpm run dev  # http://localhost:4321
```

## API Overview

### Swaps
- `getPrice()` - Get indicative price
- `getQuote()` - Get firm quote with transaction data
- `validateQuoteAgainstPrice()` - Validate quote
- `submitQuoteTransaction()` - Submit swap transaction

### Token
- `approveAllowance()` - Approve token spending
- `retrieveAllowance()` - Check current allowance
- `retrieveTokenWithDetails()` - Get token metadata

### User
- `retrieveTokensWithBalance()` - Get all tokens with balances
- `retrieveTokenWithBalance()` - Get single token balance

### Tokens
- `retrieveUniswapTokens()` - Get tokens from Uniswap
- `retrieveBlockscoutTokens()` - Get tokens from Blockscout
- `searchSelectorTokens()` - Search tokens for UI selectors

## Development

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Run tests
pnpm test

# Type checking
pnpm typecheck

# Build
pnpm build
```

## License

MIT