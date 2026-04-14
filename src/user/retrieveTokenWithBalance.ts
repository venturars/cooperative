import type { Address } from "viem";
import { SUPPORTED_CHAIN_IDS } from "../chains/definitions";
import type { TokenWithBalance } from "../token/types";
import { isValidAddress, NATIVE_TOKEN_ADDRESS } from "../utils";
import { retrieveTokenWithDetails } from "../token/retrieveTokenWithDetails";
import { retrieveTokensWithBalance } from "./retrieveTokensWithBalance";

/** Parameters for {@link retrieveTokenWithBalance}. */
export interface RetrieveTokenWithBalanceParams {
  walletAddress: Address;
  chainId: number;
  tokenAddress: Address;
}

/**
 * Returns a single token’s balance row for a wallet on a chain, or zero balance with details if not held.
 *
 * @throws {Error} On invalid wallet/chain/token or upstream errors.
 */
export async function retrieveTokenWithBalance(
  params: RetrieveTokenWithBalanceParams,
): Promise<TokenWithBalance> {
  const { walletAddress, chainId, tokenAddress } = params;

  if (!isValidAddress(walletAddress))
    throw new Error("Valid wallet address is required");
  if (!SUPPORTED_CHAIN_IDS.includes(chainId as never))
    throw new Error("Unsupported chainId");
  if (!isValidAddress(tokenAddress, { allowNative: true, strict: false }))
    throw new Error("Invalid token address");

  const tokens = await retrieveTokensWithBalance(walletAddress, {
    networks: [chainId],
  });
  const tokenAddressKey = tokenAddress.toLowerCase();
  const match = tokens.find(
    (token) =>
      token.address.toLowerCase() === tokenAddressKey ||
      (tokenAddressKey === NATIVE_TOKEN_ADDRESS.toLowerCase() &&
        token.address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()),
  );

  if (!match) {
    const tokenWithDetails = await retrieveTokenWithDetails(
      chainId,
      tokenAddress,
    );
    return {
      ...tokenWithDetails,
      balance: 0n,
      fiatBalance: "0",
    };
  }

  return match;
}
