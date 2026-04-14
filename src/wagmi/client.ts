import {
  readContract,
  sendTransaction,
  waitForTransactionReceipt,
  writeContract,
  type Config,
} from "@wagmi/core";
import { erc20Abi } from "viem";
import type { ChainClient } from "./types";

/**
 * Wraps a wagmi `Config` as a {@link ChainClient} for use with {@link configureSetup}.
 *
 * @param wagmiConfig - Result of {@link createCooperativeConfig} (or compatible `Config`).
 */
export function createWagmiChainClient(wagmiConfig: Config): ChainClient {
  const config = wagmiConfig;

  return {
    async sendTransaction(input) {
      return sendTransaction(config, {
        chainId: input.chainId,
        to: input.to,
        data: input.data,
        value: input.value,
        gas: input.gas,
        gasPrice: input.gasPrice,
      });
    },

    async writeApprove(input) {
      return writeContract(config, {
        address: input.tokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [input.spenderAddress, input.amount],
        chainId: input.chainId,
      });
    },

    async readAllowance(input) {
      return readContract(config, {
        address: input.tokenAddress,
        abi: erc20Abi,
        functionName: "allowance",
        args: [input.ownerAddress, input.spenderAddress],
        chainId: input.chainId,
      });
    },

    async waitReceipt(input) {
      try {
        const receipt = await waitForTransactionReceipt(config, {
          hash: input.hash,
          chainId: input.chainId,
        });
        return receipt.status === "success";
      } catch {
        return false;
      }
    },
  };
}
