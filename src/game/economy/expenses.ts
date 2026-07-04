import type { GameState } from "../types";
import type { DailyExpensesBreakdown } from "./types";
import { BASE_DAILY_COST } from "./types";

function calculateInfrastructureCost(users: number): number {
  if (users < 1_000) return 5;
  if (users < 10_000) return 25;
  if (users < 100_000) return 100;
  if (users < 500_000) return 300;
  if (users < 1_000_000) return 700;
  return 1200;
}

function calculateTechDebtCost(techDebt: number): number {
  if (techDebt < 30) return 0;
  if (techDebt < 60) return 30;
  if (techDebt < 80) return 80;
  return 150;
}

function calculateBugCost(bugs: number): number {
  if (bugs < 10) return 0;
  if (bugs < 25) return 25;
  if (bugs < 50) return 75;
  return 150;
}

function calculatePerformanceCost(performance: number): number {
  if (performance > 70) return 0;
  if (performance > 50) return 25;
  if (performance > 30) return 75;
  return 150;
}

export function calculateExpenses(state: GameState): DailyExpensesBreakdown {
  const base = BASE_DAILY_COST;
  const infrastructure = calculateInfrastructureCost(state.users);
  const techDebt = calculateTechDebtCost(state.techDebt);
  const bugs = calculateBugCost(state.bugs);
  const performance = calculatePerformanceCost(state.performance);
  const total = base + infrastructure + techDebt + bugs + performance;

  return { base, infrastructure, techDebt, bugs, performance, total };
}
