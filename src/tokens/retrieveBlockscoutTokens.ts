import { SUPPORTED_CHAIN_IDS } from "../chains/definitions";
import type { TokenWithChainId } from "../token/types";
import { resolveHttpClient } from "../setup";

const MIN_ITEMS_COUNT = 1;
const MAX_ITEMS_COUNT = 50;

/** Options for {@link retrieveBlockscoutTokens}. */
export interface RetrieveBlockscoutTokensOptions {
  chainId: number;
  q?: string;
  itemsCount?: number;
}

/**
 * Lists tokens from Blockscout-backed index via Cooperative API (`/tokens/blockscout-tokens`).
 *
 * @throws {Error} On unsupported chain, invalid `itemsCount`, or bad response shape.
 */
export async function retrieveBlockscoutTokens(
  options: RetrieveBlockscoutTokensOptions,
): Promise<TokenWithChainId[]> {
  if (!SUPPORTED_CHAIN_IDS.includes(options.chainId as never))
    throw new Error("Unsupported chainId");

  if (
    options.itemsCount !== undefined &&
    (!Number.isInteger(options.itemsCount) ||
      options.itemsCount < MIN_ITEMS_COUNT ||
      options.itemsCount > MAX_ITEMS_COUNT)
  )
    throw new Error(
      `itemsCount must be an integer between ${MIN_ITEMS_COUNT} and ${MAX_ITEMS_COUNT}`,
    );

  const params = new URLSearchParams();
  params.set("chainId", String(options.chainId));
  if (options.q?.trim()) params.set("q", options.q.trim());
  if (options.itemsCount !== undefined)
    params.set("itemsCount", String(options.itemsCount));

  const httpClient = resolveHttpClient();
  const body = await httpClient.get<{ tokens?: unknown }>(
    `/tokens/blockscout-tokens?${params.toString()}`,
  );
  if (!Array.isArray(body.tokens))
    throw new Error("Invalid response shape from Blockscout tokens API");

  return body.tokens as TokenWithChainId[];
}
