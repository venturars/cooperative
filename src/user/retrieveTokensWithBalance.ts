import type { Address } from "viem";
import type { TokenWithBalance } from "../token/types";
import { isValidAddress, isValidSupportedChainIdList } from "../utils";
import { resolveHttpClient } from "../setup";

/** Options for {@link retrieveTokensWithBalance}. */
export interface RetrieveTokensWithBalanceOptions {
  networks?: number[];
}

interface TokenWithBalanceJSON extends Omit<TokenWithBalance, "balance"> {
  balance: string;
}

/**
 * Fetches token balances with fiat metadata for a wallet via Cooperative API (`/user/tokens`).
 *
 * @param options.networks - When set, restricts to supported chain IDs only.
 * @throws {Error} On invalid address or networks filter.
 */
export async function retrieveTokensWithBalance(
  address: Address,
  options?: RetrieveTokensWithBalanceOptions,
): Promise<TokenWithBalance[]> {
  if (!isValidAddress(address))
    throw new Error("Valid wallet address is required");

  if (options?.networks && !isValidSupportedChainIdList(options.networks))
    throw new Error(
      "Invalid networks parameter: must be a non-empty array of supported chain IDs",
    );

  const params = new URLSearchParams({ address });
  if (options?.networks?.length) {
    params.set("networks", JSON.stringify(options.networks));
  }

  const httpClient = resolveHttpClient();
  const tokens = await httpClient.get<TokenWithBalanceJSON[]>(
    `/user/tokens?${params.toString()}`,
  );
  return tokens.map((t) => ({
    ...t,
    balance: BigInt(t.balance),
  })) as TokenWithBalance[];
}
