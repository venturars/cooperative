import type { Address } from "viem";
import { resolveChainClient } from "../setup";
import { SUPPORTED_CHAIN_IDS } from "../chains/definitions";
import { isValidAddress, MAX_UINT256, NATIVE_TOKEN_ADDRESS } from "../utils";

/**
 * Reads ERC-20 `allowance(owner, spender)`. Native token address returns {@link MAX_UINT256} (no approval needed).
 *
 * @throws {Error} On invalid inputs or if {@link configureSetup} was not called.
 */
export async function retrieveAllowance(
  chainId: number,
  tokenAddress: Address,
  ownerAddress: Address,
  spenderAddress: Address,
): Promise<bigint> {
  if (!SUPPORTED_CHAIN_IDS.includes(chainId as never))
    throw new Error("Unsupported chainId");
  if (!isValidAddress(tokenAddress, { allowNative: true, strict: false }))
    throw new Error("Invalid tokenAddress");
  if (!isValidAddress(ownerAddress, { strict: false }))
    throw new Error("Invalid ownerAddress");
  if (!isValidAddress(spenderAddress, { strict: false }))
    throw new Error("Invalid spenderAddress");
  if (tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase())
    return MAX_UINT256;

  const chainClient = resolveChainClient();
  return chainClient.readAllowance({
    chainId,
    tokenAddress,
    ownerAddress,
    spenderAddress,
  });
}
