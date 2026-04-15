---
title: Basic Usage
description: Learn how to use the Cooperative SDK in your project
---

# Basic Usage

## Quick Examples

### Configure the SDK

```typescript
import { configureSetup, createWagmiChainClient } from 'cooperative';
import { createConfig, http } from 'wagmi';
import { mainnet } from 'viem/chains';

// Create wagmi config
const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

// Configure once at app startup
configureSetup({
  chainClient: createWagmiChainClient(config),
});
```

### Get a Swap Quote

```typescript
import { getQuote } from 'cooperative';
import { parseEther } from 'viem';

const quote = await getQuote({
  takerAddress: '0x...', // User's wallet address
  chainId: 1, // Ethereum
  tokenIn: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH
  tokenOut: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  sellAmount: parseEther('1'), // 1 ETH
});

console.log(`You'll receive ${quote.buyAmount} USDC`);
```

### Check Token Balances

```typescript
import { retrieveTokensWithBalance } from 'cooperative';

const tokens = await retrieveTokensWithBalance({
  chainId: 1,
  address: '0x...', // User's address
});

tokens.forEach(token => {
  console.log(`${token.symbol}: ${token.balanceFormatted} ($${token.balanceUSD})`);
});
```

## Common Patterns

### Error Handling

```typescript
import { getQuote } from 'cooperative';

try {
  const quote = await getQuote(params);
} catch (error) {
  if (error.message.includes('Unsupported chain')) {
    console.log('This chain is not supported');
  } else if (error.message.includes('Invalid address')) {
    console.log('Please check the address format');
  } else {
    console.error('Failed to get quote:', error);
  }
}
```

### Loading States

```typescript
// React/Next.js example
import { useState } from 'react';
import { getQuote } from 'cooperative';

function SwapForm() {
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(null);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const result = await getQuote(params);
      setQuote(result);
    } catch (error) {
      console.error('Failed to fetch quote:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchQuote} disabled={loading}>
        {loading ? 'Getting quote...' : 'Get Quote'}
      </button>
      {quote && (
        <div>
          <p>Expected output: {quote.buyAmount}</p>
          <p>Price impact: {quote.priceImpact}%</p>
        </div>
      )}
    </div>
  );
}
```

## TypeScript Support

The SDK provides full TypeScript support:

```typescript
import type { GetSwapQuoteParams, QuotePrice } from 'cooperative';

// Type-safe parameters
const params: GetSwapQuoteParams = {
  takerAddress: '0x...',
  chainId: 1,
  tokenIn: '0x...',
  tokenOut: '0x...',
  sellAmount: 1000000000000000000n,
};

// Type-safe return value
const quote: QuotePrice = await getQuote(params);
```

## Next Steps

- Learn about [Configuration](/getting-started/configuration/) options
- Explore the complete [API Reference](/api-reference/setup/)
- Check [Common Issues](/misc/contributing/#common-issues) for troubleshooting