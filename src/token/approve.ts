import type { Address } from "viem";
import { resolveChainClient } from "../setup";
import { SUPPORTED_CHAIN_IDS } from "../chains/definitions";
import { isValidAddress, MAX_UINT256, NATIVE_TOKEN_ADDRESS } from "../utils";

/**
 * Sends `approve(spender, amount)` for an ERC-20. Rejects native-token address.
 *
 * @param amount - Defaults to unlimited ({@link MAX_UINT256}).
 * @throws {Error} On invalid inputs, native token, or if {@link configureSetup} was not called.
 */
export async function approveAllowance(
  chainId: number,
  tokenAddress: Address,
  spenderAddress: Address,
  amount: bigint = MAX_UINT256,
): Promise<`0x${string}`> {
  if (!SUPPORTED_CHAIN_IDS.includes(chainId as never))
    throw new Error("Unsupported chainId");
  if (!isValidAddress(tokenAddress, { allowNative: true, strict: false }))
    throw new Error("Invalid tokenAddress");
  if (!isValidAddress(spenderAddress, { strict: false }))
    throw new Error("Invalid spenderAddress");
  if (amount < 0n) throw new Error("Invalid allowance amount");
  if (tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase())
    throw new Error("Native token does not require approval");

  const chainClient = resolveChainClient();
  return chainClient.writeApprove({
    chainId,
    tokenAddress,
    spenderAddress,
    amount,
  });
}
