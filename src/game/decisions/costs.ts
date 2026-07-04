import type { GameState } from "../types";

export function getSeverityMultiplier(severity: string): number {
  const multipliers: Record<string, number> = {
    low: 0.5,
    medium: 1,
    high: 2,
    critical: 4,
  };
  return multipliers[severity] ?? 1;
}

export function calculateActionCost(
  state: GameState,
  category: string,
  severity: string
): number {
  const multiplier = getSeverityMultiplier(severity);

  switch (category) {
    case "infrastructure":
      return Math.round(
        Math.max(state.dailyExpenses * multiplier, state.mrr * 0.005, 1000)
      );
    case "product":
      return Math.round(
        Math.max(state.mrr * 0.003 * multiplier, state.dailyRevenue * multiplier, 800)
      );
    case "security":
      return Math.round(
        Math.max(state.dailyExpenses * 2 * multiplier, state.mrr * 0.01 * multiplier, 3000)
      );
    case "growth":
      return Math.round(
        Math.max(state.dailyRevenue * 1.5 * multiplier, state.mrr * 0.002 * multiplier, 1000)
      );
    case "business":
      return Math.round(
        Math.max(state.dailyRevenue * multiplier, state.mrr * 0.002, 500)
      );
    default:
      return Math.round(Math.max(state.dailyExpenses * multiplier, 500));
  }
}
