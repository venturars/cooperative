import type { Address } from "viem";

export type SwapFee = {
  type: "tools" | "platform" | "gas";
  token: Address;
  amount: bigint;
  amountUsd: string;
};

export type SwapPrice = {
  liquidityAvailable: boolean;
  blockNumber: number;
  gas: bigint;
  gasPrice: bigint;
  totalNetworkFee: bigint;
  takerAddress: Address;
  recipientAddress: Address;
  tokenIn: {
    address: Address;
    amount: bigint;
    fiatValue: string;
  };
  tokenOut: {
    address: Address;
    expectedAmount: bigint;
    expectedFiatValue: string;
    minAmount: bigint;
    minFiatValue: string;
  };
  fees: SwapFee[];
  feePriceImpact: number | null;
  feePriceImpactUsd: string | null;
  swapPriceImpact: number | null;
  swapPriceImpactUsd: string | null;
  priceImpactBps: number | null;
  priceImpactUsd: string | null;
  slippageBps: number;
  allowanceTarget: Address;
};

export type QuotePrice = {
  allowanceTarget: Address;
  blockNumber: number;
  simulationIncomplete: boolean;
  liquidityAvailable: boolean;
  tokenIn: {
    address: Address;
    amount: bigint;
    fiatValue: string;
  };
  tokenOut: {
    address: Address;
    expectedAmount: bigint;
    expectedFiatValue: string;
    minAmount: bigint;
    minFiatValue: string;
  };
  fees: SwapFee[];
  transaction: {
    to: Address;
    data: `0x${string}`;
    value: bigint;
    gas: bigint;
    gasPrice: bigint;
  };
};
