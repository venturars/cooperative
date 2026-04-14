import type { Chain } from "viem";
import { mainnet, polygon, base } from "viem/chains";

export { mainnet, polygon, base };

/** Chain IDs supported by the Cooperative SDK (Ethereum mainnet, Polygon, Base). */
export type CooperativeChainId = 1 | 137 | 8453;
/** A viem `Chain` definition used by Cooperative. */
export type CooperativeChain = Chain;

/** Ordered tuple of Cooperative-supported chains for wagmi `createConfig`. */
export const cooperativeChains: readonly [Chain, ...Chain[]] = [
  mainnet,
  polygon,
  base,
];

/** All {@link CooperativeChainId} values as a flat array for validation and iteration. */
export const SUPPORTED_CHAIN_IDS: CooperativeChainId[] = [
  mainnet.id,
  polygon.id,
  base.id,
];
