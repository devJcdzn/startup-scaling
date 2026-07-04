import type { GameState } from "../types";
import type { DailyRevenueBreakdown } from "./types";
import { BASE_ARPU } from "./types";
import { calculateConversionRate } from "./conversion";

export function calculateRevenue(state: GameState): DailyRevenueBreakdown {
  const conversionRate = calculateConversionRate(state);
  const payingUsers = Math.floor(state.users * conversionRate);
  const arpu = BASE_ARPU;
  const mrr = payingUsers * arpu;
  const dailyRevenue = Math.floor(mrr / 30);

  return { payingUsers, conversionRate, arpu, mrr, dailyRevenue };
}
