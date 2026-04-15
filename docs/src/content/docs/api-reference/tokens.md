---
title: Tokens API
description: Token discovery and search functions
---

Functions for discovering and searching tokens.

## `retrieveUniswapTokens`

Get tokens from Uniswap token lists.

### Parameters

```typescript
retrieveUniswapTokens(options?: RetrieveUniswapTokensOptions): Promise<Token[]>
```

#### `RetrieveUniswapTokensOptions`

| Parameter  | Type     | Required | Description                             |
| ---------- | -------- | -------- | --------------------------------------- |
| `chainId?` | `number` | No       | Filter by chain ID                      |
| `search?`  | `string` | No       | Search by name or symbol                |
| `limit?`   | `number` | No       | Maximum number of tokens (default: 100) |

### Returns

`Promise<Token[]>` - Array of tokens.

#### `Token`

```typescript
{
  chainId: number;
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  logoUrl?: string;
}
```

### Example

```typescript
import { retrieveUniswapTokens } from "cooperative";

// Get all tokens on Ethereum
const tokens = await retrieveUniswapTokens({
  chainId: 1,
  limit: 50,
});

// Search for specific tokens
const usdcTokens = await retrieveUniswapTokens({
  search: "USDC",
  chainId: 1,
});
```

## `retrieveBlockscoutTokens`

Get tokens from Blockscout explorers.

### Parameters

```typescript
retrieveBlockscoutTokens(options?: RetrieveBlockscoutTokensOptions): Promise<Token[]>
```

#### `RetrieveBlockscoutTokensOptions`

Same as `RetrieveUniswapTokensOptions`.

### Returns

`Promise<Token[]>` - Array of tokens.

### Example

```typescript
import { retrieveBlockscoutTokens } from "cooperative";

// Get tokens from Blockscout
const tokens = await retrieveBlockscoutTokens({
  chainId: 137, // Polygon
  search: "MATIC",
});
```

## `searchSelectorTokens`

Search tokens for selectors with multiple sources.

### Parameters

```typescript
searchSelectorTokens(params: SearchSelectorTokensParams): Promise<Token[]>
```

#### `SearchSelectorTokensParams`

| Parameter         | Type                           | Required | Description                  |
| ----------------- | ------------------------------ | -------- | ---------------------------- |
| `query`           | `string`                       | Yes      | Search query                 |
| `chainId`         | `number`                       | Yes      | Chain ID                     |
| `emptyQueryMode?` | `SearchSelectorEmptyQueryMode` | No       | Behavior when query is empty |

#### `SearchSelectorEmptyQueryMode`

```typescript
type SearchSelectorEmptyQueryMode =
  | "return-empty" // Return empty array
  | "return-popular" // Return popular tokens
  | "return-all"; // Return all tokens (not recommended)
```

### Returns

`Promise<Token[]>` - Array of tokens matching search.

### Example

```typescript
import { searchSelectorTokens } from "cooperative";

// Search for tokens in a selector
const tokens = await searchSelectorTokens({
  query: "USDC",
  chainId: 1,
});

// Get popular tokens when search is empty
const popularTokens = await searchSelectorTokens({
  query: "",
  chainId: 1,
  emptyQueryMode: "return-popular",
});
```

## Complete Token Selector Example

```typescript
import { searchSelectorTokens } from 'cooperative';
import { useState, useEffect } from 'react';

function TokenSelector({ chainId, onSelect }) {
  const [query, setQuery] = useState('');
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchTokens = async () => {
      setLoading(true);
      try {
        const results = await searchSelectorTokens({
          query,
          chainId,
          emptyQueryMode: query ? 'return-empty' : 'return-popular',
        });
        setTokens(results);
      } catch (error) {
        console.error('Failed to search tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchTokens, 300);
    return () => clearTimeout(timeoutId);
  }, [query, chainId]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tokens..."
      />

      {loading ? (
        <div>Loading tokens...</div>
      ) : (
        <ul>
          {tokens.map((token) => (
            <li key={`${token.chainId}-${token.address}`}>
              <button onClick={() => onSelect(token)}>
                <img src={token.logoUrl} alt={token.symbol} width={24} height={24} />
                <span>{token.name} ({token.symbol})</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```
