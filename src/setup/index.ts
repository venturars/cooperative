import type { ChainClient } from "../wagmi/types";
import type { HttpClient } from "../http/types";
import { createFetchHttpClient } from "../http/client";

const API_BASE_URL = process.env.COOPERATIVE_API_BASE_URL!;

/** Runtime wiring: on-chain actions use this client after {@link configureSetup}. */
export interface SetupConfig {
  chainClient: ChainClient;
}

let setupConfig: SetupConfig | null = null;
let httpClient: HttpClient | null = null;

/**
 * Must be called once before functions that use {@link resolveChainClient} (allowance, approve, swaps submit, receipts).
 *
 * @param config - Chain client typically from {@link createWagmiChainClient}.
 */
export function configureSetup(config: SetupConfig): void {
  setupConfig = config;
}

/** Lazy singleton HTTP client for Cooperative API (`COOPERATIVE_API_BASE_URL`). */
export function resolveHttpClient(): HttpClient {
  if (!httpClient)
    httpClient = createFetchHttpClient({ baseUrl: API_BASE_URL });
  return httpClient;
}

/**
 * Returns the configured {@link ChainClient}, or throws if {@link configureSetup} was not called.
 *
 * @throws {Error} When the SDK has not been configured.
 */
export function resolveChainClient(): ChainClient {
  if (!setupConfig) {
    throw new Error("SDK is not configured. Call configureSetup() first.");
  }
  return setupConfig.chainClient;
}
