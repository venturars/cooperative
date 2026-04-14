import type { QuotePrice, SwapPrice } from "../types";

/** Thresholds (basis points and block drift) for {@link validateQuoteAgainstPrice}. */
export interface QuoteAcceptabilityTolerance {
  maxExpectedAmountDropBps: number;
  maxMinAmountDropBps: number;
  maxFeeIncreaseBps: number;
  maxGasIncreaseBps: number;
  maxGasPriceIncreaseBps: number;
  maxBlockDrift: number;
  allowSimulationIncomplete: boolean;
}

/** Measured deltas between a prior price and the current quote. */
export interface QuoteAcceptabilityMetrics {
  expectedAmountDropBps: number;
  minAmountDropBps: number;
  maxFeeIncreaseBps: number;
  gasIncreaseBps: number;
  gasPriceIncreaseBps: number;
  blockDrift: number;
}

/** Outcome of comparing a quote to an earlier price snapshot. */
export interface QuoteAcceptabilityResult {
  acceptable: boolean;
  reasons: string[];
  metrics: QuoteAcceptabilityMetrics;
}

/** Default tolerances for slippage, fee drift, gas drift, and block lag. */
export const DEFAULT_QUOTE_ACCEPTABILITY_TOLERANCE: QuoteAcceptabilityTolerance =
  {
    maxExpectedAmountDropBps: 50,
    maxMinAmountDropBps: 100,
    maxFeeIncreaseBps: 100,
    maxGasIncreaseBps: 2500,
    maxGasPriceIncreaseBps: 3000,
    maxBlockDrift: 5,
    allowSimulationIncomplete: false,
  };

function calculateDropBps(reference: bigint, current: bigint): number {
  if (reference <= 0n) return current <= 0n ? 0 : 10_000;
  if (current >= reference) return 0;
  return Number(((reference - current) * 10_000n) / reference);
}

function calculateIncreaseBps(reference: bigint, current: bigint): number {
  if (reference <= 0n) return current <= 0n ? 0 : 10_000;
  if (current <= reference) return 0;
  return Number(((current - reference) * 10_000n) / reference);
}

function getFeeKey(fee: { type: string; token: string }): string {
  return `${fee.type}:${fee.token.toLowerCase()}`;
}

/**
 * Checks whether a fresh {@link QuotePrice} is still acceptable vs a prior {@link SwapPrice} (amounts, fees, gas, blocks).
 *
 * @param toleranceOverrides - Partial overrides merged with {@link DEFAULT_QUOTE_ACCEPTABILITY_TOLERANCE}.
 */
export function validateQuoteAgainstPrice(
  price: SwapPrice,
  quote: QuotePrice,
  toleranceOverrides: Partial<QuoteAcceptabilityTolerance> = {},
): QuoteAcceptabilityResult {
  const tolerance: QuoteAcceptabilityTolerance = {
    ...DEFAULT_QUOTE_ACCEPTABILITY_TOLERANCE,
    ...toleranceOverrides,
  };
  const reasons: string[] = [];

  if (!price.liquidityAvailable || !quote.liquidityAvailable)
    reasons.push("Liquidity is not available");
  if (
    price.allowanceTarget.toLowerCase() !== quote.allowanceTarget.toLowerCase()
  )
    reasons.push("Allowance target changed between price and quote");

  if (
    price.tokenIn.address.toLowerCase() !== quote.tokenIn.address.toLowerCase()
  )
    reasons.push("tokenIn address changed between price and quote");

  if (
    price.tokenOut.address.toLowerCase() !==
    quote.tokenOut.address.toLowerCase()
  )
    reasons.push("tokenOut address changed between price and quote");

  if (price.tokenIn.amount !== quote.tokenIn.amount)
    reasons.push("tokenIn amount changed between price and quote");

  if (quote.simulationIncomplete && !tolerance.allowSimulationIncomplete)
    reasons.push("Quote simulation is incomplete");

  const blockDrift = Math.abs(quote.blockNumber - price.blockNumber);
  if (blockDrift > tolerance.maxBlockDrift)
    reasons.push(
      `Block drift too high: ${blockDrift} > ${tolerance.maxBlockDrift}`,
    );

  const expectedAmountDropBps = calculateDropBps(
    price.tokenOut.expectedAmount,
    quote.tokenOut.expectedAmount,
  );
  if (expectedAmountDropBps > tolerance.maxExpectedAmountDropBps)
    reasons.push(
      `Expected output dropped too much: ${expectedAmountDropBps} bps > ${tolerance.maxExpectedAmountDropBps} bps`,
    );

  const minAmountDropBps = calculateDropBps(
    price.tokenOut.minAmount,
    quote.tokenOut.minAmount,
  );
  if (minAmountDropBps > tolerance.maxMinAmountDropBps)
    reasons.push(
      `Minimum output dropped too much: ${minAmountDropBps} bps > ${tolerance.maxMinAmountDropBps} bps`,
    );

  const gasIncreaseBps = calculateIncreaseBps(
    price.gas,
    quote.transaction.gas,
  );
  if (gasIncreaseBps > tolerance.maxGasIncreaseBps)
    reasons.push(
      `Estimated gas increased too much: ${gasIncreaseBps} bps > ${tolerance.maxGasIncreaseBps} bps`,
    );

  const gasPriceIncreaseBps = calculateIncreaseBps(
    price.gasPrice,
    quote.transaction.gasPrice,
  );
  if (gasPriceIncreaseBps > tolerance.maxGasPriceIncreaseBps)
    reasons.push(
      `Gas price increased too much: ${gasPriceIncreaseBps} bps > ${tolerance.maxGasPriceIncreaseBps} bps`,
    );

  const priceFees = new Map(price.fees.map((fee) => [getFeeKey(fee), fee]));
  const quoteFees = new Map(quote.fees.map((fee) => [getFeeKey(fee), fee]));
  const allFeeKeys = new Set([...priceFees.keys(), ...quoteFees.keys()]);
  let maxFeeIncreaseBps = 0;

  for (const key of allFeeKeys) {
    const priceFee = priceFees.get(key);
    const quoteFee = quoteFees.get(key);
    if (!priceFee || !quoteFee) {
      reasons.push("Fee structure changed between price and quote");
      continue;
    }
    const feeIncreaseBps = calculateIncreaseBps(
      priceFee.amount,
      quoteFee.amount,
    );
    maxFeeIncreaseBps = Math.max(maxFeeIncreaseBps, feeIncreaseBps);
  }

  if (maxFeeIncreaseBps > tolerance.maxFeeIncreaseBps)
    reasons.push(
      `Fees increased too much: ${maxFeeIncreaseBps} bps > ${tolerance.maxFeeIncreaseBps} bps`,
    );

  return {
    acceptable: reasons.length === 0,
    reasons,
    metrics: {
      expectedAmountDropBps,
      minAmountDropBps,
      maxFeeIncreaseBps,
      gasIncreaseBps,
      gasPriceIncreaseBps,
      blockDrift,
    },
  };
}
