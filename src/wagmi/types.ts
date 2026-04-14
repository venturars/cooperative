import type { Address, Hex } from "viem";

/**
 * Abstraction over chain operations (send tx, ERC-20 approve/allowance, receipt wait).
 * Implemented by {@link createWagmiChainClient} using `@wagmi/core`.
 */
export interface ChainClient {
  /** Sends a raw transaction (e.g. swap calldata from a quote). */
  sendTransaction(input: {
    chainId: number;
    to: Address;
    data: Hex;
    value: bigint;
    gas: bigint;
    gasPrice: bigint;
  }): Promise<`0x${string}`>;

  /** ERC-20 `approve(spender, amount)`. */
  writeApprove(input: {
    chainId: number;
    tokenAddress: Address;
    spenderAddress: Address;
    amount: bigint;
  }): Promise<`0x${string}`>;

  /** ERC-20 `allowance(owner, spender)`. */
  readAllowance(input: {
    chainId: number;
    tokenAddress: Address;
    ownerAddress: Address;
    spenderAddress: Address;
  }): Promise<bigint>;

  /** Waits for receipt; returns `true` if status is success, `false` on revert or wait error. */
  waitReceipt(input: {
    hash: `0x${string}`;
    chainId: number;
  }): Promise<boolean>;
}
