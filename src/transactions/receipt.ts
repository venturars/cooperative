import { resolveChainClient } from "../setup";

/**
 * Waits for a transaction receipt and returns `true` if execution succeeded, `false` on failure or error.
 *
 * @throws {Error} If {@link configureSetup} was not called.
 */
export async function waitReceipt(
  hash: `0x${string}`,
  chainId: number,
): Promise<boolean> {
  const chainClient = resolveChainClient();
  return chainClient.waitReceipt({ hash, chainId });
}
