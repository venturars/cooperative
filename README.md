# Cooperative SDK

TypeScript SDK for building DeFi applications with token swaps, balances, and on-chain utilities. Built on **wagmi** + **viem**, integrated with **0x Protocol** for swaps, and connected to the **Cooperative API** for off-chain data.

## 🎯 What This SDK Solves

Building DeFi apps involves repetitive boilerplate: wallet connection, chain configuration, token approvals, swap quoting, balance fetching. This SDK packages those patterns so you can focus on your app's unique logic.

**Core capabilities:**
- **Token swaps** via 0x Protocol with price validation
- **Balance aggregation** across supported chains
- **Token discovery** from Uniswap and Blockscout
- **Chain utilities** for Ethereum, Polygon, and Base
- **Transaction helpers** for approvals and receipt waiting

## 🚀 First 15 Minutes

### 1. Install

```bash
npm install cooperative
```

**Peer dependencies** (your app provides these):
```json
{
  "@wagmi/core": "3.5.0",
  "viem": "2.47.6"
}
```

### 2. Configure the SDK

Your app needs to wire the SDK once with your wagmi configuration:

```typescript
import { configureSetup, createWagmiChainClient } from "cooperative";
import { createConfig, http } from "wagmi";
import { mainnet, polygon, base } from "viem/chains";

// 1. Create your wagmi config (or use existing)
const wagmiConfig = createConfig({
  chains: [mainnet, polygon, base],
  transports: {
    [mainnet.id]: http("https://eth-mainnet.g.alchemy.com/v2/..."),
    [polygon.id]: http("https://polygon-mainnet.g.alchemy.com/v2/..."),
    [base.id]: http("https://base-mainnet.g.alchemy.com/v2/..."),
  },
});

// 2. Wire the SDK with your config
configureSetup({
  chainClient: createWagmiChainClient(wagmiConfig),
});
```

**Note:** If you skip this step, any function that needs on-chain access (transactions, approvals) will throw.

### 3. Quick Examples

#### Get a swap quote
```typescript
import { getQuote } from "cooperative";

const quote = await getQuote({
  sellToken: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // ETH
  buyToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  sellAmount: "1000000000000000000", // 1 ETH in wei
  chainId: 1, // Ethereum
});

console.log(`You'll receive ${quote.buyAmount} USDC`);
console.log(`Price impact: ${quote.priceImpact}%`);
```

#### Check token allowance
```typescript
import { retrieveAllowance } from "cooperative";

const allowance = await retrieveAllowance({
  chainId: 1,
  tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  ownerAddress: "0x...", // User's address
  spenderAddress: "0x...", // Contract that needs approval
});

if (allowance < requiredAmount) {
  // Need to approve
  const tx = await approveAllowance({ /* ... */ });
}
```

#### Get user's token balances
```typescript
import { retrieveTokensWithBalance } from "cooperative";

const tokens = await retrieveTokensWithBalance({
  chainId: 1,
  address: "0x...", // User's address
});

tokens.forEach(token => {
  console.log(`${token.symbol}: ${token.balance} ($${token.balanceUSD})`);
});
```

## 🏗️ Project Structure

```
src/
├── index.ts              # Public API exports
├── setup/               # Runtime configuration
├── wagmi/              # wagmi ↔ ChainClient bridge
├── chains/             # Chain definitions & metadata
├── swaps/              # 0x Protocol integration
│   └── 0x/            # Price, quote, validation, submission
├── token/              # Token operations (allowance, approve, details)
├── tokens/             # Token discovery (Uniswap, Blockscout)
├── user/               # Balance aggregation
├── transactions/       # Receipt utilities
├── http/               # HTTP client for Cooperative API
└── utils/              # Formatting, constants, helpers
```

## 🔧 For Package Developers

### Build System
The SDK uses `tsup` with environment-based API URL injection:

```bash
# Production build (wired to production API)
npm run build

# Development build (wired to localhost:4321)
npm run build:dev

# Watch mode for active development
npm run dev

# Type checking
npm run typecheck
```

### Key Design Decisions

1. **Build-time API URL**: `COOPERATIVE_API_BASE_URL` is injected at build time via `tsup`, not configurable at runtime. This ensures each published version points to a specific API instance.

2. **ChainClient pattern**: On-chain operations go through a `ChainClient` interface abstracted from wagmi. This keeps wagmi as a peer dependency while allowing alternative implementations.

3. **HTTP client singleton**: API calls use a lazy-initialized HTTP client that reads the build-injected base URL.

4. **Supported chains only**: The SDK explicitly supports Ethereum (1), Polygon (137), and Base (8453). Constants and types enforce this boundary.

### Adding a New Feature

1. **Add to `src/index.ts`** for public export
2. **Use `resolveHttpClient()`** for API calls
3. **Use `resolveChainClient()`** for on-chain operations
4. **Add comprehensive TypeScript types**
5. **Update this README** with usage examples

## 📚 API Reference

For complete API documentation, see the [TypeDoc reference](https://docs.cooperative.finance/typescript).

Key modules:
- **Swaps**: `getPrice`, `getQuote`, `submitQuoteTransaction`, `validateQuoteAgainstPrice`
- **Token**: `approveAllowance`, `retrieveAllowance`, `retrieveTokenWithDetails`
- **Tokens**: `retrieveUniswapTokens`, `retrieveBlockscoutTokens`, `searchSelectorTokens`
- **User**: `retrieveTokensWithBalance`, `retrieveTokenWithBalance`
- **Utils**: Formatting, address validation, logo URLs, constants

## 🔗 Cooperative API Integration

The SDK expects a Cooperative backend at the URL configured during build. Key endpoints:

| Endpoint | SDK Function |
|----------|--------------|
| `GET /swaps/get-price` | `getPrice` |
| `GET /swaps/get-quote` | `getQuote` |
| `GET /token/{chainId}/{address}` | `retrieveTokenWithDetails` |
| `GET /user/tokens` | `retrieveTokensWithBalance` |
| `GET /tokens/uniswap-tokens` | `retrieveUniswapTokens` |

## 🐛 Troubleshooting

**"SDK is not configured" error**
```typescript
// You forgot to call configureSetup()
import { configureSetup, createWagmiChainClient } from "cooperative";
configureSetup({ chainClient: createWagmiChainClient(yourWagmiConfig) });
```

**Swap submission fails**
- Ensure `configureSetup()` was called with a wagmi config
- User must have connected wallet with correct chain
- Check token approvals before swap

**Type errors with chain IDs**
- Use `SUPPORTED_CHAIN_IDS` constant (1, 137, 8453)
- Import chain definitions: `mainnet`, `polygon`, `base`

## 📦 Publishing

1. Update version in `package.json`
2. `npm run build` (production API URL)
3. `npm publish`

## 📄 License

MIT - see [LICENSE](LICENSE) file.

---

**Need help?** Open an issue or join the [Cooperative Discord](https://discord.gg/cooperative).