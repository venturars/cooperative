import {
  mainnet,
  polygon,
  base,
  type CooperativeChainId,
} from "../chains/definitions";

/** Sentinel address used for “native” ETH (not an ERC-20 contract). */
export const NATIVE_TOKEN_ADDRESS =
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

/** Base URL for Trust Wallet blockchain asset logos (native chain logos). */
export const TRUST_WALLET_ASSETS_BASE =
  "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains";

/** Base URL for Smold token logos by chain and address. */
export const SMOL_TOKEN_ASSETS_BASE = "https://assets.smold.app/api/token";

/** Maximum `uint256`, used as “unlimited” allowance for native-token shortcuts. */
export const MAX_UINT256: bigint = BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
);

/** Alchemy network name segment for RPC hostnames (`eth-mainnet`, `base-mainnet`, `matic-mainnet`). */
export const ALCHEMY_NETWORKS: Record<CooperativeChainId, string> = {
  [mainnet.id]: "eth-mainnet",
  [base.id]: "base-mainnet",
  [polygon.id]: "matic-mainnet",
};

/**
 * Network slug for Alchemy Prices API (Polygon uses `polygon-mainnet` instead of `matic-mainnet`).
 */
export function alchemyPricesNetworkSlug(chainId: CooperativeChainId): string {
  if (chainId === polygon.id) return "polygon-mainnet";
  return ALCHEMY_NETWORKS[chainId];
}

/** Trust Wallet folder names per chain for native logo paths. */
export const SMOL_DAPP_NETWORKS: Record<CooperativeChainId, string> = {
  [mainnet.id]: "ethereum",
  [base.id]: "base",
  [polygon.id]: "polygon",
};
