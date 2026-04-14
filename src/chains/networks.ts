import { mainnet, polygon, base } from "./definitions";
import type { Network } from "./types";

/** Static registry of Cooperative-supported networks with explorer URLs and RPC hostnames. */
export const SUPPORTED_NETWORKS: Network[] = [
  {
    name: "Ethereum",
    chainId: mainnet.id,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
    },
    rpcBaseUrl: "https://eth-mainnet.g.alchemy.com/v2",
    explorerUrl: "https://etherscan.io",
  },
  {
    name: "Base",
    chainId: base.id,
    nativeCurrency: {
      name: "Base",
      symbol: "ETH",
      decimals: 18,
      logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png",
    },
    rpcBaseUrl: "https://base-mainnet.g.alchemy.com/v2",
    explorerUrl: "https://basescan.org",
  },
  {
    name: "Polygon",
    chainId: polygon.id,
    nativeCurrency: {
      name: "Polygon",
      symbol: "POL",
      decimals: 18,
      logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
    },
    rpcBaseUrl: "https://polygon-mainnet.g.alchemy.com/v2",
    explorerUrl: "https://polygonscan.com",
  },
];
