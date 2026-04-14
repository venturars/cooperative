import type { Address } from "viem";
import { SUPPORTED_CHAIN_IDS } from "../chains/definitions";
import type { TokenWithChainId, TokenWithBalance } from "../token/types";
import { isValidAddress } from "../utils";
import { retrieveTokenWithDetails } from "../token/retrieveTokenWithDetails";
import { retrieveBlockscoutTokens } from "./retrieveBlockscoutTokens";
import { retrieveTokensWithBalance } from "../user/retrieveTokensWithBalance";

/** When the search query is empty: show top tokens or wallet balances on the chain. */
export type SearchSelectorEmptyQueryMode = "balances" | "top20";

const BLOCKSCOUT_PREVIEW_COUNT = 20;

/** Parameters for {@link searchSelectorTokens}. */
export interface SearchSelectorTokensParams {
  walletAddress: Address;
  chainId: number;
  query: string;
  emptyQueryMode?: SearchSelectorEmptyQueryMode;
}

/**
 * Token picker search: empty query uses Blockscout top list or user balances; non-empty merges balances + Blockscout and resolves single address lookups.
 *
 * @throws {Error} On invalid chain, address, or upstream failures.
 */
export async function searchSelectorTokens(
  params: SearchSelectorTokensParams,
): Promise<(TokenWithChainId | TokenWithBalance)[]> {
  const { walletAddress, chainId, query, emptyQueryMode = "top20" } = params;

  if (!SUPPORTED_CHAIN_IDS.includes(chainId as never))
    throw new Error("Invalid chain ID");

  const q = query.trim();

  if (q === "") {
    if (emptyQueryMode === "top20") {
      try {
        const list = await retrieveBlockscoutTokens({
          chainId,
          itemsCount: BLOCKSCOUT_PREVIEW_COUNT,
        });
        return list.slice(0, BLOCKSCOUT_PREVIEW_COUNT);
      } catch {
        throw new Error("Failed to load Blockscout token list");
      }
    }

    if (!isValidAddress(walletAddress))
      throw new Error("Invalid wallet address");
    try {
      return await retrieveTokensWithBalance(walletAddress, {
        networks: [chainId],
      });
    } catch {
      throw new Error("Failed to retrieve tokens with balance");
    }
  }

  if (!isValidAddress(walletAddress)) throw new Error("Invalid wallet address");

  if (isValidAddress(q, { allowNative: true, strict: false })) {
    try {
      const token = await retrieveTokenWithDetails(chainId, q as Address);
      return [token];
    } catch {
      throw new Error("Failed to retrieve token details");
    }
  }

  const needle = q.toLowerCase();

  function matchesQuery(t: {
    symbol: string;
    name: string;
    address: string;
  }): boolean {
    return (
      t.symbol.toLowerCase().includes(needle) ||
      t.name.toLowerCase().includes(needle) ||
      t.address.toLowerCase().includes(needle)
    );
  }

  const addrKey = (a: string) => a.toLowerCase();

  try {
    const [balanceTokens, blockscoutList] = await Promise.all([
      retrieveTokensWithBalance(walletAddress, { networks: [chainId] }),
      retrieveBlockscoutTokens({ chainId, q }),
    ]);

    const held = new Set(balanceTokens.map((t) => addrKey(t.address)));
    const blockscoutMatching = blockscoutList.filter(matchesQuery);
    const blockscoutMatchKeys = new Set(
      blockscoutMatching.map((t) => addrKey(t.address)),
    );

    const blockscoutHeld = blockscoutMatching.filter((t) =>
      held.has(addrKey(t.address)),
    );
    const blockscoutNotHeld = blockscoutMatching.filter(
      (t) => !held.has(addrKey(t.address)),
    );

    const balanceOnlyMatching = balanceTokens.filter(
      (b) => matchesQuery(b) && !blockscoutMatchKeys.has(addrKey(b.address)),
    );

    return [...blockscoutHeld, ...balanceOnlyMatching, ...blockscoutNotHeld];
  } catch {
    throw new Error(
      "Failed to retrieve tokens with balance or Blockscout list",
    );
  }
}
