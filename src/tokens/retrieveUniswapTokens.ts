import type { Address } from "viem";
import { SUPPORTED_CHAIN_IDS } from "../chains/definitions";
import type { TokenWithChainId } from "../token/types";
import { isValidAddress } from "../utils";
import { resolveHttpClient } from "../setup";

/** Optional filters for {@link retrieveUniswapTokens}. */
export interface RetrieveUniswapTokensOptions {
  addresses?: readonly Address[];
  chainId?: number;
  symbol?: string;
  name?: string;
}

/**
 * Queries Uniswap-indexed tokens via Cooperative API (`/tokens/uniswap-tokens`).
 *
 * @throws {Error} On unsupported `chainId`, invalid addresses in filter, or bad response shape.
 */
export async function retrieveUniswapTokens(
  options?: RetrieveUniswapTokensOptions,
): Promise<TokenWithChainId[]> {
  if (
    options?.chainId !== undefined &&
    !SUPPORTED_CHAIN_IDS.includes(options.chainId as never)
  )
    throw new Error("Unsupported chainId");

  const params = new URLSearchParams();
  if (options?.addresses?.length) {
    for (const addr of options.addresses) {
      if (!isValidAddress(addr, { allowNative: true, strict: false }))
        throw new Error("Invalid token address in addresses filter");
      params.append("address", addr);
    }
  }
  if (options?.chainId !== undefined)
    params.set("chainId", String(options.chainId));
  if (options?.symbol?.trim()) params.set("symbol", options.symbol.trim());
  if (options?.name?.trim()) params.set("name", options.name.trim());

  const httpClient = resolveHttpClient();
  const query = params.toString();
  const body = await httpClient.get<{ tokens?: unknown }>(
    query ? `/tokens/uniswap-tokens?${query}` : "/tokens/uniswap-tokens",
  );
  if (!Array.isArray(body.tokens))
    throw new Error("Invalid response shape from Uniswap tokens API");

  return body.tokens as TokenWithChainId[];
}
