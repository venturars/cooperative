---
title: Swaps API
description: Token swap functions using 0x Protocol
---

Functions for token swaps using 0x Protocol.

## `getPrice`

Get an indicative price for a token swap.

### Parameters

```typescript
getPrice(params: GetSwapPriceParams): Promise<SwapPrice>
```

#### `GetSwapPriceParams`

| Parameter         | Type      | Required | Description                                       |
| ----------------- | --------- | -------- | ------------------------------------------------- |
| `takerAddress`    | `Address` | Yes      | Address that will execute the swap                |
| `chainId`         | `number`  | Yes      | Chain ID (1, 137, or 8453)                        |
| `tokenIn`         | `Address` | Yes      | Input token address                               |
| `tokenOut`        | `Address` | Yes      | Output token address                              |
| `sellAmount`      | `bigint`  | Yes      | Amount to sell in wei                             |
| `slippageBps?`    | `number`  | No       | Slippage tolerance in basis points (default: 100) |
| `platformFeeBps?` | `number`  | No       | Platform fee in basis points                      |

### Returns

`Promise<SwapPrice>` - Indicative price information.

#### `SwapPrice`

```typescript
{
  tokenIn: Address;
  tokenOut: Address;
  sellAmount: bigint;
  buyAmount: bigint;
  priceImpact: number;
  fees: SwapFee[];
  allowanceTarget: Address;
  gasEstimate: bigint;
  gasEstimateUsd: number;
}
```

### Example

```typescript
import { getPrice } from "cooperative";
import { parseEther } from "viem";

const price = await getPrice({
  takerAddress: "0x...",
  chainId: 1,
  tokenIn: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // ETH
  tokenOut: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  sellAmount: parseEther("1"), // 1 ETH
  slippageBps: 50, // 0.5% slippage
});

console.log(`Expected output: ${price.buyAmount} USDC`);
console.log(`Price impact: ${price.priceImpact}%`);
```

### Errors

- **`Error: Unsupported chain`** - Chain ID not in [1, 137, 8453]
- **`Error: Invalid address`** - Invalid token or taker address
- **`Error: Slippage outside allowed range`** - Slippage < 0 or > 1000 BPS

## `getQuote`

Get a firm quote with transaction data.

### Parameters

```typescript
getQuote(params: GetSwapQuoteParams): Promise<QuotePrice>
```

#### `GetSwapQuoteParams`

Same as `GetSwapPriceParams`.

### Returns

`Promise<QuotePrice>` - Firm quote with transaction data.

#### `QuotePrice`

```typescript
{
  tokenIn: Address;
  tokenOut: Address;
  sellAmount: bigint;
  buyAmount: bigint;
  minBuyAmount: bigint;
  priceImpact: number;
  fees: SwapFee[];
  allowanceTarget: Address;
  transaction: {
    to: Address;
    data: Hex;
    value: bigint;
    gas: bigint;
    gasPrice: bigint;
  };
}
```

### Example

```typescript
import { getQuote } from "cooperative";

const quote = await getQuote({
  takerAddress: "0x...",
  chainId: 1,
  tokenIn: ETH_ADDRESS,
  tokenOut: USDC_ADDRESS,
  sellAmount: parseEther("1"),
});

console.log(`Transaction to: ${quote.transaction.to}`);
console.log(`Gas estimate: ${quote.transaction.gas}`);
```

## `validateQuoteAgainstPrice`

Validate a quote against a price to ensure it's still acceptable.

### Parameters

```typescript
validateQuoteAgainstPrice(
  price: SwapPrice,
  quote: QuotePrice,
  tolerance?: QuoteAcceptabilityTolerance
): QuoteAcceptabilityResult
```

#### `QuoteAcceptabilityTolerance`

| Parameter                 | Type     | Default | Description                            |
| ------------------------- | -------- | ------- | -------------------------------------- |
| `maxPriceDeviationBps`    | `number` | 50      | Max price deviation in BPS (0.5%)      |
| `maxSlippageDeviationBps` | `number` | 100     | Max slippage deviation in BPS (1%)     |
| `maxTimeDeltaMs`          | `number` | 30000   | Max time between price and quote (30s) |

### Returns

`QuoteAcceptabilityResult` - Validation result.

#### `QuoteAcceptabilityResult`

```typescript
{
  acceptable: boolean;
  reasons: string[];
  metrics: QuoteAcceptabilityMetrics;
}
```

### Example

```typescript
import { getPrice, getQuote, validateQuoteAgainstPrice } from "cooperative";

// Get price first
const price = await getPrice(params);

// User takes some time...
await new Promise((resolve) => setTimeout(resolve, 10000));

// Get quote
const quote = await getQuote(params);

// Validate
const result = validateQuoteAgainstPrice(price, quote);

if (!result.acceptable) {
  console.error("Quote no longer valid:", result.reasons);
  return;
}

// Quote is valid, proceed
```

## `submitQuoteTransaction`

Submit a quote transaction to the blockchain.

### Parameters

```typescript
submitQuoteTransaction(chainId: number, quote: QuotePrice): Promise<`0x${string}`>
```

### Returns

`Promise<`0x${string}`>` - Transaction hash.

### Example

```typescript
import { submitQuoteTransaction } from "cooperative";

const txHash = await submitQuoteTransaction(1, quote);

console.log(`Transaction submitted: ${txHash}`);

// Wait for receipt
import { waitReceipt } from "cooperative";
const receipt = await waitReceipt({ hash: txHash, chainId: 1 });
```

### Errors

- **`Error: SDK is not configured`** - Forgot to call `configureSetup()`
- **`Error: User rejected transaction`** - User cancelled in wallet
- **`Error: Insufficient funds`** - Not enough balance for gas + value

## Complete Swap Example

```typescript
import {
  getPrice,
  getQuote,
  validateQuoteAgainstPrice,
  submitQuoteTransaction,
  waitReceipt,
} from "cooperative";
import { parseEther } from "viem";

async function executeSwap(
  takerAddress: Address,
  chainId: number,
  tokenIn: Address,
  tokenOut: Address,
  amount: string,
) {
  try {
    // 1. Get indicative price
    const price = await getPrice({
      takerAddress,
      chainId,
      tokenIn,
      tokenOut,
      sellAmount: parseEther(amount),
    });

    // 2. Get firm quote
    const quote = await getQuote({
      takerAddress,
      chainId,
      tokenIn,
      tokenOut,
      sellAmount: parseEther(amount),
    });

    // 3. Validate quote
    const validation = validateQuoteAgainstPrice(price, quote);
    if (!validation.acceptable) {
      throw new Error(`Quote invalid: ${validation.reasons.join(", ")}`);
    }

    // 4. Submit transaction
    const txHash = await submitQuoteTransaction(chainId, quote);
    console.log(`Transaction submitted: ${txHash}`);

    // 5. Wait for confirmation
    const receipt = await waitReceipt({ hash: txHash, chainId });
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);

    return receipt;
  } catch (error) {
    console.error("Swap failed:", error);
    throw error;
  }
}
```
