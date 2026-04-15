---
title: Token API
description: Token allowance, approval, and details functions
---

Functions for token allowance management and token details.

## `approveAllowance`

Approve a spender to spend tokens on behalf of the owner.

### Parameters

```typescript
approveAllowance(params: ApproveAllowanceParams): Promise<`0x${string}`>
```

#### `ApproveAllowanceParams`

| Parameter        | Type      | Required | Description                               |
| ---------------- | --------- | -------- | ----------------------------------------- |
| `chainId`        | `number`  | Yes      | Chain ID (1, 137, or 8453)                |
| `tokenAddress`   | `Address` | Yes      | Token contract address                    |
| `spenderAddress` | `Address` | Yes      | Address to approve                        |
| `amount`         | `bigint`  | Yes      | Amount to approve in wei                  |
| `ownerAddress?`  | `Address` | No       | Owner address (default: connected wallet) |

### Returns

`Promise<`0x${string}`>` - Transaction hash.

### Example

```typescript
import { approveAllowance } from "cooperative";
import { parseUnits } from "viem";

const txHash = await approveAllowance({
  chainId: 1,
  tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  spenderAddress: "0x...", // Contract that needs approval
  amount: parseUnits("1000", 6), // 1000 USDC (6 decimals)
});

console.log(`Approval transaction: ${txHash}`);
```

### Notes

- If `ownerAddress` is not provided, uses the currently connected wallet
- Never approves unlimited amounts for security
- Waits for transaction confirmation before returning

## `retrieveAllowance`

Check how much a spender is allowed to spend.

### Parameters

```typescript
retrieveAllowance(params: RetrieveAllowanceParams): Promise<bigint>
```

#### `RetrieveAllowanceParams`

| Parameter        | Type      | Required | Description              |
| ---------------- | --------- | -------- | ------------------------ |
| `chainId`        | `number`  | Yes      | Chain ID                 |
| `tokenAddress`   | `Address` | Yes      | Token contract address   |
| `ownerAddress`   | `Address` | Yes      | Token owner address      |
| `spenderAddress` | `Address` | Yes      | Approved spender address |

### Returns

`Promise<bigint>` - Allowance amount in wei.

### Example

```typescript
import { retrieveAllowance } from "cooperative";

const allowance = await retrieveAllowance({
  chainId: 1,
  tokenAddress: USDC_ADDRESS,
  ownerAddress: userAddress,
  spenderAddress: contractAddress,
});

console.log(`Allowance: ${allowance} wei`);
```

## `retrieveTokenWithDetails`

Get token details including metadata and current price.

### Parameters

```typescript
retrieveTokenWithDetails(params: RetrieveTokenWithDetailsParams): Promise<TokenWithDetails>
```

#### `RetrieveTokenWithDetailsParams`

| Parameter | Type      | Required | Description            |
| --------- | --------- | -------- | ---------------------- |
| `chainId` | `number`  | Yes      | Chain ID               |
| `address` | `Address` | Yes      | Token contract address |

### Returns

`Promise<TokenWithDetails>` - Token details.

#### `TokenWithDetails`

```typescript
{
  chainId: number;
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  logoUrl?: string;
  priceUsd?: number;
  priceChange24h?: number;
}
```

### Example

```typescript
import { retrieveTokenWithDetails } from "cooperative";

const token = await retrieveTokenWithDetails({
  chainId: 1,
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
});

console.log(`Token: ${token.name} (${token.symbol})`);
console.log(`Price: $${token.priceUsd}`);
console.log(`24h change: ${token.priceChange24h}%`);
```

## Complete Approval Flow

```typescript
import { retrieveAllowance, approveAllowance } from "cooperative";
import { parseUnits } from "viem";

async function ensureAllowance(
  chainId: number,
  tokenAddress: Address,
  spenderAddress: Address,
  requiredAmount: bigint,
): Promise<void> {
  // Check current allowance
  const currentAllowance = await retrieveAllowance({
    chainId,
    tokenAddress,
    ownerAddress: userAddress,
    spenderAddress,
  });

  // If insufficient, approve more
  if (currentAllowance < requiredAmount) {
    const approvalAmount = requiredAmount * 2n; // Approve 2x required

    console.log(`Approving ${approvalAmount} tokens...`);

    const txHash = await approveAllowance({
      chainId,
      tokenAddress,
      spenderAddress,
      amount: approvalAmount,
    });

    console.log(`Approval transaction: ${txHash}`);

    // Wait for confirmation (optional)
    import { waitReceipt } from "cooperative";
    await waitReceipt({ hash: txHash, chainId });

    console.log("Approval confirmed");
  } else {
    console.log("Sufficient allowance already exists");
  }
}
```

## Native Token Support

For native tokens (ETH, MATIC), use the special address:

```typescript
import { NATIVE_TOKEN_ADDRESS } from "cooperative";

// ETH on Ethereum
const ethAddress = NATIVE_TOKEN_ADDRESS; // '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

// No approval needed for native tokens in swaps
// The SDK handles this automatically
```

## Error Handling

### Common Errors

```typescript
import { approveAllowance } from "cooperative";

try {
  const txHash = await approveAllowance(params);
} catch (error) {
  if (error.message.includes("user rejected")) {
    console.log("User cancelled approval");
  } else if (error.message.includes("insufficient funds")) {
    console.log("Not enough ETH for gas");
  } else if (error.message.includes("execution reverted")) {
    console.log("Token contract rejected approval");
  } else {
    console.error("Approval failed:", error);
  }
}
```
