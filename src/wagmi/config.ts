import { createConfig, type Config } from "@wagmi/core";
import type { Transport } from "viem";
import {
  cooperativeChains,
  type CooperativeChainId,
} from "../chains/definitions";

/**
 * Builds a wagmi `Config` for Cooperative chains (mainnet, Polygon, Base) with the given viem transports.
 *
 * @param transports - One `Transport` per supported chain ID (e.g. `http` with Alchemy URL).
 */
export function createCooperativeConfig(
  transports: Record<CooperativeChainId, Transport>,
): Config {
  return createConfig({
    chains: cooperativeChains,
    transports: transports as Record<number, Transport>,
  });
}
