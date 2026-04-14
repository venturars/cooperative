import type { Address } from "viem";
import { SUPPORTED_CHAIN_IDS } from "../chains/definitions";
import type { TokenWithDetails } from "./types";
import { isValidAddress } from "../utils";
import { resolveHttpClient } from "../setup";

/**
 * Fetches token metadata and fiat quote for a chain and address via the Cooperative API.
 *
 * @throws {Error} On unsupported `chainId`, invalid address, or failed request.
 */
export async function retrieveTokenWithDetails(
  chainId: number,
  address: Address,
): Promise<TokenWithDetails> {
  if (!SUPPORTED_CHAIN_IDS.includes(chainId as never))
    throw new Error("Unsupported chainId");
  if (!isValidAddress(address, { allowNative: true, strict: false }))
    throw new Error("Invalid token address");

  const httpClient = resolveHttpClient();
  return httpClient.get<TokenWithDetails>(
    `/token/${chainId}/${encodeURIComponent(address)}`,
  );
}
