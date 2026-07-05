import type { GameState } from "../types";

export function calculateAcquisitionReadiness(state: GameState): number {
  let score = 1;

  if (state.performance < 70) score -= 0.2;
  if (state.performance < 50) score -= 0.25;

  if (state.reputation < 70) score -= 0.2;
  if (state.reputation < 50) score -= 0.25;

  if (state.bugs > 20) score -= 0.15;
  if (state.bugs > 40) score -= 0.25;

  if (state.conversionRate < 0.02) score -= 0.2;

  if (state.hype > 70) score += 0.15;
  if (state.reputation > 85) score += 0.15;

  return Math.max(0.15, Math.min(1.35, score));
}

export function getReadinessStatus(
  score: number
): "strong" | "medium" | "weak" | "dangerous" {
  if (score >= 1.1) return "strong";
  if (score >= 0.8) return "medium";
  if (score >= 0.5) return "weak";
  return "dangerous";
}

export function getReadinessFactors(state: GameState): string[] {
  const factors: string[] = [];

  if (state.performance < 70) factors.push(`Stability ${state.performance}% (below 70)`);
  if (state.performance < 50) factors.push(`Stability critically low`);

  if (state.reputation < 70) factors.push(`Reputation ${state.reputation}% (below 70)`);
  if (state.reputation < 50) factors.push(`Reputation critically low`);

  if (state.bugs > 20) factors.push(`${state.bugs} bugs (above 20)`);
  if (state.bugs > 40) factors.push(`${state.bugs} bugs (critically high)`);

  if (state.conversionRate < 0.02)
    factors.push(`Conversion ${(state.conversionRate * 100).toFixed(1)}% (below 2%)`);

  if (state.hype > 70) factors.push(`+High hype boosts acquisition`);
  if (state.reputation > 85) factors.push(`+Strong brand trust helps conversion`);

  return factors;
}
