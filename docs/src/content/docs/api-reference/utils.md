---
title: Utils API
description: Utility functions for formatting, validation, and constants
---

Utility functions and constants for common operations.

## Formatting Functions

### `formatTokenBalance`

Format a raw token balance (wei) to a human-readable string.

```typescript
formatTokenBalance(balance: bigint, decimals: number): string
```

#### Parameters

- `balance`: Raw balance in wei
- `decimals`: Token decimals (e.g., 18 for ETH, 6 for USDC)

#### Returns

`string` - Formatted balance

#### Example

```typescript
import { formatTokenBalance } from "cooperative";

// Format 1 ETH (18 decimals)
const formatted = formatTokenBalance(1000000000000000000n, 18);
console.log(formatted); // "1.0"

// Format 100 USDC (6 decimals)
const formattedUSDC = formatTokenBalance(100000000n, 6);
console.log(formattedUSDC); // "100.0"
```

### `amountToUsdScaled`

Convert token amount to USD value.

```typescript
amountToUsdScaled(amount: bigint, decimals: number, priceUsd: number): number
```

#### Example

```typescript
import { amountToUsdScaled } from "cooperative";

// 1 ETH at $2000
const usdValue = amountToUsdScaled(1000000000000000000n, 18, 2000);
console.log(usdValue); // 2000

// 100 USDC at $1.00
const usdcValue = amountToUsdScaled(100000000n, 6, 1.0);
console.log(usdcValue); // 100
```

## Validation Functions

### `isValidAddress`

Check if a string is a valid Ethereum address.

```typescript
isValidAddress(address: string): boolean
```

#### Example

```typescript
import { isValidAddress } from "cooperative";

console.log(isValidAddress("0x742d35Cc6634C0532925a3b844Bc9e...")); // true
console.log(isValidAddress("invalid")); // false
console.log(isValidAddress("0x123")); // false
```

### `isValidBps`

Check if a number is a valid basis points value (0-10000).

```typescript
isValidBps(value: number, min?: number, max?: number): boolean
```

#### Example

```typescript
import { isValidBps } from "cooperative";

console.log(isValidBps(100)); // true (1%)
console.log(isValidBps(10000)); // true (100%)
console.log(isValidBps(10001)); // false
console.log(isValidBps(-1)); // false

// With custom range
console.log(isValidBps(50, 10, 1000)); // true (0.5% within 0.1%-10%)
```

### `isValidSupportedChainIdList`

Check if chain IDs are supported.

```typescript
isValidSupportedChainIdList(chainIds: number[]): boolean
```

#### Example

```typescript
import { isValidSupportedChainIdList } from "cooperative";

console.log(isValidSupportedChainIdList([1, 137])); // true
console.log(isValidSupportedChainIdList([1, 56])); // false (56 not supported)
```

## Constants

### Chain Constants

```typescript
import {
  SUPPORTED_CHAIN_IDS,
  mainnet,
  polygon,
  base,
  cooperativeChains,
} from "cooperative";

// Supported chain IDs
console.log(SUPPORTED_CHAIN_IDS); // [1, 137, 8453]

// Chain definitions
console.log(mainnet); // { id: 1, name: 'Ethereum', ... }
console.log(polygon); // { id: 137, name: 'Polygon', ... }
console.log(base); // { id: 8453, name: 'Base', ... }

// All chains as array
console.log(cooperativeChains); // [mainnet, polygon, base]
```

### Network Constants

```typescript
import {
  SUPPORTED_NETWORKS,
  ALCHEMY_NETWORKS,
  SMOL_DAPP_NETWORKS,
} from "cooperative";

// Network configurations
console.log(SUPPORTED_NETWORKS);
console.log(ALCHEMY_NETWORKS); // Alchemy network slugs
console.log(SMOL_DAPP_NETWORKS); // Smol dApp network configs
```

### Token Constants

```typescript
import {
  NATIVE_TOKEN_ADDRESS,
  TRUST_WALLET_ASSETS_BASE,
  SMOL_TOKEN_ASSETS_BASE,
  MAX_UINT256,
} from "cooperative";

// Native token address (ETH, MATIC)
console.log(NATIVE_TOKEN_ADDRESS); // '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

// Logo URL bases
const logoUrl = `${TRUST_WALLET_ASSETS_BASE}/1/0xa0b.../logo.png`;

// Maximum uint256 value
console.log(MAX_UINT256); // 115792089237316195423570985008687907853269984665640564039457584007913129639935n
```

## Helper Functions

### `calculateBpsFromDelta`

Calculate basis points from price delta.

```typescript
calculateBpsFromDelta(original: number, current: number): number
```

#### Example

```typescript
import { calculateBpsFromDelta } from "cooperative";

// Price moved from $100 to $101
const bps = calculateBpsFromDelta(100, 101);
console.log(bps); // 100 (1% increase)

// Price moved from $100 to $99
const bps2 = calculateBpsFromDelta(100, 99);
console.log(bps2); // -100 (1% decrease)
```

### `getNetwork`

Get network configuration for a chain ID.

```typescript
getNetwork(chainId: number): Network | undefined
```

#### Example

```typescript
import { getNetwork } from "cooperative";

const network = getNetwork(1);
console.log(network?.name); // 'Ethereum Mainnet'
console.log(network?.chainId); // 1
```

### `buildLogoUrl`

Build token logo URL.

```typescript
buildLogoUrl(chainId: number, address: Address): string
```

#### Example

```typescript
import { buildLogoUrl } from "cooperative";

const logoUrl = buildLogoUrl(1, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
console.log(logoUrl); // URL to USDC logo
```

### `stringifyWithBigInt`

Stringify object with BigInt support.

```typescript
stringifyWithBigInt(obj: any): string
```

#### Example

```typescript
import { stringifyWithBigInt } from "cooperative";

const obj = {
  amount: 1000000000000000000n,
  address: "0x...",
};

const json = stringifyWithBigInt(obj);
console.log(json); // '{"amount":"1000000000000000000","address":"0x..."}'
```

## Complete Example

```typescript
import {
  formatTokenBalance,
  isValidAddress,
  amountToUsdScaled,
  NATIVE_TOKEN_ADDRESS,
} from "cooperative";

function displayTokenInfo(token: any) {
  // Validate address
  if (!isValidAddress(token.address)) {
    throw new Error("Invalid token address");
  }

  // Format balance
  const formatted = formatTokenBalance(token.balance, token.decimals);

  // Calculate USD value
  const usdValue = token.priceUsd
    ? amountToUsdScaled(token.balance, token.decimals, token.priceUsd)
    : null;

  // Check if native token
  const isNative =
    token.address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase();

  return {
    symbol: token.symbol,
    balance: formatted,
    usdValue: usdValue ? `$${usdValue.toFixed(2)}` : "N/A",
    isNative,
  };
}

// Usage
const token = {
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  symbol: "USDC",
  decimals: 6,
  balance: 150000000n, // 150 USDC
  priceUsd: 1.0,
};

const info = displayTokenInfo(token);
console.log(info);
// {
//   symbol: 'USDC',
//   balance: '150.0',
//   usdValue: '$150.00',
//   isNative: false
// }
```

## Type Guards

### Type Definitions

```typescript
import type {
  Token,
  TokenWithDetails,
  TokenWithBalance,
  CooperativeChain,
  Network,
} from "cooperative";

// Use these types for type safety
function processToken(token: Token) {
  // token has chainId, address, name, symbol, decimals
}

function processTokenWithBalance(token: TokenWithBalance) {
  // token has balance, balanceFormatted, balanceUSD
}
```

## Error Messages

Common validation error messages:

```typescript
import { isValidAddress, isValidBps } from "cooperative";

function validateSwapParams(params: any) {
  if (!isValidAddress(params.takerAddress)) {
    throw new Error("Invalid taker address");
  }

  if (!isValidAddress(params.tokenIn)) {
    throw new Error("Invalid input token address");
  }

  if (!isValidAddress(params.tokenOut)) {
    throw new Error("Invalid output token address");
  }

  if (params.slippageBps && !isValidBps(params.slippageBps, 1, 1000)) {
    throw new Error("Slippage must be between 0.01% and 10%");
  }

  if (![1, 137, 8453].includes(params.chainId)) {
    throw new Error(
      "Unsupported chain. Use: 1 (Ethereum), 137 (Polygon), 8453 (Base)",
    );
  }
}
```
