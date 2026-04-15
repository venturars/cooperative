---
title: User API
description: User balance and token information functions
---

Functions for getting user token balances and information.

## `retrieveTokensWithBalance`

Get all tokens with balances for a user address.

### Parameters

```typescript
retrieveTokensWithBalance(options: RetrieveTokensWithBalanceOptions): Promise<TokenWithBalance[]>
```

#### `RetrieveTokensWithBalanceOptions`

| Parameter   | Type       | Required | Description                                 |
| ----------- | ---------- | -------- | ------------------------------------------- |
| `address`   | `Address`  | Yes      | User address                                |
| `chainId`   | `number`   | Yes      | Chain ID                                    |
| `chainIds?` | `number[]` | No       | Multiple chain IDs (alternative to chainId) |

### Returns

`Promise<TokenWithBalance[]>` - Array of tokens with balances.

#### `TokenWithBalance`

```typescript
{
  chainId: number;
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  logoUrl?: string;
  balance: bigint;        // Raw balance in wei
  balanceFormatted: string; // Formatted balance
  balanceUSD?: number;    // USD value if price available
  priceUsd?: number;      // Current price in USD
}
```

### Example

```typescript
import { retrieveTokensWithBalance } from "cooperative";

// Get balances on Ethereum
const tokens = await retrieveTokensWithBalance({
  address: "0x...",
  chainId: 1,
});

// Get balances across multiple chains
const multiChainTokens = await retrieveTokensWithBalance({
  address: "0x...",
  chainIds: [1, 137, 8453], // Ethereum, Polygon, Base
});

// Display balances
tokens.forEach((token) => {
  console.log(
    `${token.symbol}: ${token.balanceFormatted} ($${token.balanceUSD})`,
  );
});
```

## `retrieveTokenWithBalance`

Get balance for a specific token.

### Parameters

```typescript
retrieveTokenWithBalance(params: RetrieveTokenWithBalanceParams): Promise<TokenWithBalance>
```

#### `RetrieveTokenWithBalanceParams`

| Parameter      | Type      | Required | Description            |
| -------------- | --------- | -------- | ---------------------- |
| `address`      | `Address` | Yes      | User address           |
| `chainId`      | `number`  | Yes      | Chain ID               |
| `tokenAddress` | `Address` | Yes      | Token contract address |

### Returns

`Promise<TokenWithBalance>` - Token with balance information.

### Example

```typescript
import { retrieveTokenWithBalance } from "cooperative";

const token = await retrieveTokenWithBalance({
  address: "0x...",
  chainId: 1,
  tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
});

console.log(`USDC Balance: ${token.balanceFormatted}`);
console.log(`Value: $${token.balanceUSD}`);
```

## Complete Balance Display Example

```typescript
import { retrieveTokensWithBalance } from 'cooperative';
import { useState, useEffect } from 'react';

function BalanceDisplay({ address }) {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) return;

      setLoading(true);
      try {
        const tokens = await retrieveTokensWithBalance({
          address,
          chainIds: [1, 137, 8453], // All supported chains
        });

        setBalances(tokens);

        // Calculate total portfolio value
        const total = tokens.reduce((sum, token) => {
          return sum + (token.balanceUSD || 0);
        }, 0);

        setTotalValue(total);
      } catch (error) {
        console.error('Failed to fetch balances:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();

    // Refresh every 30 seconds
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [address]);

  if (loading) {
    return <div>Loading balances...</div>;
  }

  return (
    <div>
      <h2>Portfolio: ${totalValue.toFixed(2)}</h2>

      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Balance</th>
            <th>Value</th>
            <th>Chain</th>
          </tr>
        </thead>
        <tbody>
          {balances.map((token) => (
            <tr key={`${token.chainId}-${token.address}`}>
              <td>
                {token.logoUrl && (
                  <img src={token.logoUrl} alt={token.symbol} width={20} height={20} />
                )}
                <span>{token.symbol}</span>
              </td>
              <td>{token.balanceFormatted}</td>
              <td>${(token.balanceUSD || 0).toFixed(2)}</td>
              <td>
                {token.chainId === 1 && 'Ethereum'}
                {token.chainId === 137 && 'Polygon'}
                {token.chainId === 8453 && 'Base'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Native Token Balances

The SDK automatically includes native token balances (ETH, MATIC):

```typescript
import { retrieveTokensWithBalance, NATIVE_TOKEN_ADDRESS } from "cooperative";

const tokens = await retrieveTokensWithBalance({
  address: "0x...",
  chainId: 1,
});

// Native ETH will be included with address: NATIVE_TOKEN_ADDRESS
const ethBalance = tokens.find(
  (t) => t.address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase(),
);
```
