import type { Address } from "viem";
import { SUPPORTED_CHAIN_IDS } from "../../chains/definitions";
import type { SwapPrice } from "../types";
import { isValidAddress, isValidBps } from "../../utils";
import { resolveHttpClient } from "../../setup";

export interface GetSwapPriceParams {
  takerAddress: Address;
  chainId: number;
  tokenIn: Address;
  tokenOut: Address;
  sellAmount: bigint;
  recipientAddress?: Address;
  slippageBps?: number;
  platformFeeBps?: number;
}

interface SwapPriceJson extends Omit<
  SwapPrice,
  "gas" | "gasPrice" | "totalNetworkFee" | "tokenIn" | "tokenOut" | "fees"
> {
  gas: string;
  gasPrice: string;
  totalNetworkFee: string;
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
}

/**
 * Fetches an indicative swap price (gas estimates, impact, fees).
 *
 * @throws {Error} On validation failure or API error.
 */
export async function getPrice(params: GetSwapPriceParams): Promise<SwapPrice> {
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
  const payload = await httpClient.get<SwapPriceJson>(
    `/swaps/get-price?${searchParams.toString()}`,
  );

  return {
    ...payload,
    gas: BigInt(payload.gas),
    gasPrice: BigInt(payload.gasPrice),
    totalNetworkFee: BigInt(payload.totalNetworkFee),
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
  };
}
