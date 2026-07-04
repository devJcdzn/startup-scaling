export const BASE_ARPU = 29;
export const BASE_CONVERSION_RATE = 0.02;
export const BASE_DAILY_COST = 20;

export interface DailyExpensesBreakdown {
  base: number;
  infrastructure: number;
  techDebt: number;
  bugs: number;
  performance: number;
  total: number;
}

export interface DailyRevenueBreakdown {
  payingUsers: number;
  conversionRate: number;
  arpu: number;
  mrr: number;
  dailyRevenue: number;
}

export interface EconomyResult {
  conversionRate: number;
  payingUsers: number;
  arpu: number;
  mrr: number;
  dailyRevenue: number;
  dailyExpenses: number;
  dailyBalance: number;
  runwayDays: number | "profitable";
  dailyExpensesBreakdown: DailyExpensesBreakdown;
  dailyRevenueBreakdown: DailyRevenueBreakdown;
}
