import type { GameState } from "../types";
import type { DecisionImpact, DecisionForecast, ForecastItem } from "./types";
import { calculateEconomy } from "../economy";

function formatMoney(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function formatStat(value: number, stat: string): string {
  if (stat === "money" || stat === "dailyBalance" || stat === "dailyRevenue" || stat === "dailyExpenses" || stat === "mrr") {
    return formatMoney(value);
  }
  if (stat === "conversionRate") {
    return `${(value * 100).toFixed(1)}%`;
  }
  if (stat === "users" || stat === "payingUsers") {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toLocaleString();
  }
  return `${Math.round(value)}`;
}

function getStatLabel(stat: string): string {
  const labels: Record<string, string> = {
    money: "Cash",
    users: "Users",
    payingUsers: "Paying Users",
    mrr: "MRR",
    dailyRevenue: "Revenue/day",
    dailyExpenses: "Expenses/day",
    dailyBalance: "Daily Balance",
    performance: "Platform Stability",
    reputation: "Reputation",
    hype: "Hype",
    techDebt: "Tech Debt",
    bugs: "Bugs",
    conversionRate: "Conversion Rate",
  };
  return labels[stat] ?? stat;
}

function getMeaning(
  stat: string,
  before: number,
  after: number
): "good" | "bad" | "mixed" | "neutral" {
  const improvedStats = new Set([
    "money", "users", "payingUsers", "mrr", "dailyRevenue",
    "dailyBalance", "performance", "reputation", "hype", "conversionRate",
  ]);
  const reducedBad = new Set(["techDebt", "bugs", "dailyExpenses"]);

  if (before === after) return "neutral";

  if (improvedStats.has(stat)) {
    return after > before ? "good" : "bad";
  }
  if (reducedBad.has(stat)) {
    return after < before ? "good" : "bad";
  }
  return "mixed";
}

export function simulateDecision(
  state: GameState,
  impact: DecisionImpact
): GameState {
  const next = { ...state };

  for (const effect of impact.immediate) {
    const key = effect.stat as keyof GameState;
    if (typeof next[key] === "number") {
      (next as any)[key] = (next[key] as number) + effect.value;
    }
  }

  if (impact.modifiers) {
    for (const mod of impact.modifiers) {
      for (const eff of mod.effects) {
        if (eff.stat && eff.mode === "flat" && eff.interval === "day") {
          const key = eff.stat as keyof GameState;
          if (typeof next[key] === "number") {
            (next as any)[key] = (next[key] as number) + eff.value;
          }
        }
      }
    }
  }

  return next;
}

export function calculateForecast(
  state: GameState,
  impact: DecisionImpact
): DecisionForecast {
  const projected = simulateDecision(state, impact);

  const statsToCompare = new Set<string>();
  for (const e of impact.immediate) statsToCompare.add(e.stat);
  if (impact.modifiers) {
    for (const m of impact.modifiers) {
      for (const e of m.effects) {
        if (e.stat) statsToCompare.add(e.stat);
      }
    }
  }

  const items: ForecastItem[] = [];

  for (const stat of statsToCompare) {
    const key = stat as keyof GameState;
    const before = state[key];
    const after = projected[key];

    if (typeof before === "number" && typeof after === "number" && before !== after) {
      items.push({
        label: getStatLabel(stat),
        before: formatStat(before, stat),
        after: formatStat(after, stat),
        direction: after > before ? "up" : after < before ? "down" : "neutral",
        meaning: getMeaning(stat, before, after),
      });
    }
  }

  const positiveCount = items.filter((i) => i.meaning === "good").length;
  const negativeCount = items.filter((i) => i.meaning === "bad").length;

  let summary: string;
  if (positiveCount > 0 && negativeCount > 0) {
    summary = "Mixed impact — some metrics improve, others decline.";
  } else if (positiveCount > 0) {
    summary = "Positive impact across affected metrics.";
  } else if (negativeCount > 0) {
    summary = "Negative impact — proceed with caution.";
  } else {
    summary = "Minimal visible impact on current metrics.";
  }

  return {
    title: "Forecast",
    summary,
    items,
  };
}
