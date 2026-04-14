import type { Address } from "viem";

export type Token = {
  address: Address;
  decimals: number;
  name: string;
  symbol: string;
  logo: string;
};

export interface TokenWithChainId extends Token {
  chainId: number;
}

export type TokenWithDetails = TokenWithChainId & {
  fiatValue: string;
  fiatCurrency: string;
  lastUpdatedAt: string;
};

export type TokenWithBalance = TokenWithDetails & {
  balance: bigint;
  fiatBalance: string;
};
