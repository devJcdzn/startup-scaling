import type { GameState } from "../types";
import type { EconomyResult } from "./types";
import { calculateRevenue } from "./revenue";
import { calculateExpenses } from "./expenses";
import { calculateRunway } from "./runway";

export function calculateEconomy(state: GameState): EconomyResult {
  const revenue = calculateRevenue(state);
  const expenses = calculateExpenses(state);
  const dailyBalance = revenue.dailyRevenue - expenses.total;
  const runwayDays = calculateRunway(state.money, dailyBalance);

  return {
    conversionRate: revenue.conversionRate,
    payingUsers: revenue.payingUsers,
    arpu: revenue.arpu,
    mrr: revenue.mrr,
    dailyRevenue: revenue.dailyRevenue,
    dailyExpenses: expenses.total,
    dailyBalance,
    runwayDays,
    dailyExpensesBreakdown: expenses,
    dailyRevenueBreakdown: revenue,
  };
}

export type { EconomyResult, DailyExpensesBreakdown, DailyRevenueBreakdown } from "./types";
