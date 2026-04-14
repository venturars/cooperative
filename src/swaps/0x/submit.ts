import { isHex } from "viem";
import { resolveChainClient } from "../../setup";
import { SUPPORTED_CHAIN_IDS } from "../../chains/definitions";
import type { QuotePrice } from "../types";
import { isValidAddress } from "../../utils";

/**
 * Sends the transaction from a {@link QuotePrice} using the configured {@link ChainClient}.
 *
 * @throws {Error} On invalid chain, malformed quote tx fields, or if {@link configureSetup} was not called.
 */
export async function submitQuoteTransaction(
  chainId: number,
  quote: QuotePrice,
): Promise<`0x${string}`> {
  if (!SUPPORTED_CHAIN_IDS.includes(chainId as never))
    throw new Error("Unsupported chainId");
  if (!isValidAddress(quote.transaction.to, { strict: false }))
    throw new Error("Invalid quote transaction target");
  if (!isHex(quote.transaction.data, { strict: true }))
    throw new Error("Invalid quote transaction calldata");
  if (quote.transaction.value < 0n)
    throw new Error("Invalid quote transaction value");
  if (quote.transaction.gas <= 0n)
    throw new Error("Invalid quote transaction gas");
  if (quote.transaction.gasPrice <= 0n)
    throw new Error("Invalid quote transaction gasPrice");

  const chainClient = resolveChainClient();
  return chainClient.sendTransaction({
    chainId,
    to: quote.transaction.to,
    data: quote.transaction.data,
    value: quote.transaction.value,
    gas: quote.transaction.gas,
    gasPrice: quote.transaction.gasPrice,
  });
}
