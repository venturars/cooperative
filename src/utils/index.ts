import { isAddress, parseUnits } from "viem";
import { SUPPORTED_CHAIN_IDS } from "../chains/definitions";
import { SUPPORTED_NETWORKS } from "../chains/networks";
import type { Network } from "../chains/types";
import {
  SMOL_TOKEN_ASSETS_BASE,
  SMOL_DAPP_NETWORKS,
  TRUST_WALLET_ASSETS_BASE,
  NATIVE_TOKEN_ADDRESS,
} from "./constants";

export {
  NATIVE_TOKEN_ADDRESS,
  TRUST_WALLET_ASSETS_BASE,
  SMOL_TOKEN_ASSETS_BASE,
  MAX_UINT256,
  ALCHEMY_NETWORKS,
  SMOL_DAPP_NETWORKS,
  alchemyPricesNetworkSlug,
} from "./constants";

/**
 * Formats a raw uint balance hex string into a human-readable decimal string (integer or fractional part trimmed of trailing zeros).
 *
 * @param balanceHex - Token balance as hex (e.g. from RPC `balanceOf`).
 * @param decimals - ERC-20 decimals.
 */
export function formatTokenBalance(
  balanceHex: string,
  decimals: number,
): string {
  const balance = BigInt(balanceHex);
  const divisor = BigInt(10 ** decimals);
  const whole = balance / divisor;
  const fraction = balance % divisor;
  const fractionStr = fraction
    .toString()
    .padStart(decimals, "0")
    .slice(0, decimals);
  const formatted =
    fractionStr === "0".repeat(decimals)
      ? whole.toString()
      : `${whole}.${fractionStr.replace(/0+$/, "")}`;
  return formatted;
}

/** `JSON.stringify` with `bigint` values serialized as decimal strings. */
export function stringifyWithBigInt(value: unknown): string {
  return JSON.stringify(value, (_, v) =>
    typeof v === "bigint" ? v.toString() : v,
  );
}

/**
 * Converts a positive delta relative to a positive reference into basis points (1/100 of a percent).
 *
 * @returns Integer bps in `[0, 10000]` range for typical inputs; `0` if reference or delta is non-positive.
 */
export function calculateBpsFromDelta(
  reference: bigint,
  delta: bigint,
): number {
  if (reference <= 0n || delta <= 0n) return 0;
  const bps = (delta * 10_000n) / reference;
  return Number(bps);
}

/**
 * Scales a token amount by a fiat unit price (18-decimal fixed) into an 18-decimal USD-scaled bigint.
 *
 * @param amount - Raw token amount (same decimals as `decimals`).
 * @param fiatValue - Unit price as decimal string (e.g. `"1.23"`).
 * @param decimals - Token decimals.
 */
export function amountToUsdScaled(
  amount: bigint,
  fiatValue: string,
  decimals: number,
): bigint {
  return (parseUnits(fiatValue, 18) * amount) / 10n ** BigInt(decimals);
}

/** Whether `value` is an integer from 0 to 10_000 (basis points). */
export function isValidBps(value: unknown): boolean {
  if (typeof value !== "number") return false;
  return Number.isInteger(value) && value >= 0 && value <= 10_000;
}

/** Whether every ID is a supported Cooperative chain and the list is non-empty. */
export function isValidSupportedChainIdList(chainIds: number[]): boolean {
  return (
    chainIds.length > 0 &&
    chainIds.every((id) => SUPPORTED_CHAIN_IDS.includes(id as never))
  );
}

/**
 * Validates an Ethereum address; optionally treats the native-token sentinel as valid.
 *
 * @param options.allowNative - Accept `0xEeee…` native placeholder.
 * @param options.strict - Passed to viem `isAddress` (checksum).
 */
export function isValidAddress(
  address: unknown,
  options?: { allowNative?: boolean; strict?: boolean },
): boolean {
  if (typeof address !== "string") return false;
  if (
    options?.allowNative &&
    address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()
  ) {
    return true;
  }
  const strict = options?.strict ?? true;
  return isAddress(address, { strict });
}

/**
 * Looks up {@link Network} metadata for a supported chain.
 *
 * @throws {Error} If `chainId` is not in {@link SUPPORTED_NETWORKS}.
 */
export function getNetwork(chainId: number): Network {
  const network = SUPPORTED_NETWORKS.find((n) => n.chainId === chainId);
  if (!network) throw new Error(`Network with chainId ${chainId} not found`);
  return network;
}

/**
 * Builds a token logo URL (Trust Wallet for native, Smold CDN for ERC-20).
 *
 * @throws {Error} If `chainId` is not supported for logo resolution.
 */
export function buildLogoUrl(address: string, chainId: number): string {
  const blockchain = SMOL_DAPP_NETWORKS[chainId as keyof typeof SMOL_DAPP_NETWORKS];
  if (!blockchain)
    throw new Error(`Unsupported chainId for logo URL: ${chainId}`);

  if (address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()) {
    return `${TRUST_WALLET_ASSETS_BASE}/${blockchain}/info/logo.png`;
  }

  const pathAddress = address.toLowerCase();
  return `${SMOL_TOKEN_ASSETS_BASE}/${chainId}/${pathAddress}/logo-128.png`;
}
