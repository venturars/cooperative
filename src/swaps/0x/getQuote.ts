import type { Address, Hex } from "viem";
import { SUPPORTED_CHAIN_IDS } from "../../chains/definitions";
import type { QuotePrice } from "../types";
import { isValidAddress, isValidBps } from "../../utils";
import { resolveHttpClient } from "../../setup";

/** Parameters for {@link getQuote}. */
export interface GetSwapQuoteParams {
  takerAddress: Address;
  chainId: number;
  tokenIn: Address;
  tokenOut: Address;
  sellAmount: bigint;
  recipientAddress?: Address;
  slippageBps?: number;
  platformFeeBps?: number;
}

interface SwapQuoteJson
  extends Omit<
    QuotePrice,
    "tokenIn" | "tokenOut" | "fees" | "transaction"
  > {
  tokenIn: {
    address: Address;
    amount: string;
    fiatValue: string;
  };
  tokenOut: {
    address: Address;
    expectedAmount: string;
    expectedFiatValue: string;
    minAmount: string;
    minFiatValue: string;
  };
  fees: Array<{
    type: "tools" | "platform" | "gas";
    token: Address;
    amount: string;
    amountUsd: string;
  }>;
  transaction: {
    to: Address;
    data: Hex;
    value: string;
    gas: string;
    gasPrice: string;
  };
}

/**
 * Fetches a firm swap quote with calldata and gas fields ready for submission.
 *
 * @throws {Error} On validation failure or API error.
 */
export async function getQuote(
  params: GetSwapQuoteParams,
): Promise<QuotePrice> {
  const {
    takerAddress,
    chainId,
    tokenIn,
    tokenOut,
    sellAmount,
    recipientAddress,
    slippageBps = 100,
    platformFeeBps = 0,
  } = params;

  if (!SUPPORTED_CHAIN_IDS.includes(chainId as never))
    throw new Error("Invalid chainId");
  if (!isValidAddress(takerAddress)) throw new Error("Invalid takerAddress");
  if (!isValidAddress(tokenIn, { strict: false }))
    throw new Error("Invalid tokenIn");
  if (!isValidAddress(tokenOut, { strict: false }))
    throw new Error("Invalid tokenOut");
  if (tokenIn.toLowerCase() === tokenOut.toLowerCase())
    throw new Error("tokenIn and tokenOut cannot be the same");
  if (sellAmount <= 0n) throw new Error("Invalid sellAmount");
  if (
    recipientAddress !== undefined &&
    !isValidAddress(recipientAddress, { strict: false })
  )
    throw new Error("Invalid recipientAddress");
  if (!isValidBps(slippageBps))
    throw new Error("slippageBps must be an integer between 0 and 10000");
  if (!isValidBps(platformFeeBps))
    throw new Error("platformFeeBps must be an integer between 0 and 10000");

  const searchParams = new URLSearchParams({
    takerAddress,
    chainId: String(chainId),
    tokenIn,
    tokenOut,
    sellAmount: sellAmount.toString(),
    slippageBps: String(slippageBps),
    platformFeeBps: String(platformFeeBps),
  });
  if (recipientAddress) searchParams.set("recipientAddress", recipientAddress);

  const httpClient = resolveHttpClient();
  const payload = await httpClient.get<SwapQuoteJson>(
    `/swaps/get-quote?${searchParams.toString()}`,
  );

  return {
    ...payload,
    tokenIn: {
      ...payload.tokenIn,
      amount: BigInt(payload.tokenIn.amount),
    },
    tokenOut: {
      ...payload.tokenOut,
      expectedAmount: BigInt(payload.tokenOut.expectedAmount),
      minAmount: BigInt(payload.tokenOut.minAmount),
    },
    fees: payload.fees.map((fee) => ({
      ...fee,
      amount: BigInt(fee.amount),
    })),
    transaction: {
      ...payload.transaction,
      value: BigInt(payload.transaction.value),
      gas: BigInt(payload.transaction.gas),
      gasPrice: BigInt(payload.transaction.gasPrice),
    },
  };
}
