import type {
  DailyExpensesBreakdown,
  DailyRevenueBreakdown,
} from "./economy/types";
import type { ActiveModifier } from "./modifiers/types";
import type { DecisionImpact } from "./decisions/types";

export type StatKey =
  | "users"
  | "money"
  | "performance"
  | "reputation"
  | "hype"
  | "techDebt"
  | "bugs";

export type StatChange = Partial<Record<StatKey, number>>;

export interface Choice {
  text: string;
  description?: string;
  effects: StatChange;
  impact?: DecisionImpact;
}

export interface DelayPenalty {
  intervalMs: number;
  effects: StatChange;
}

export interface GameEvent {
  id: string;
  category: string;
  title: string;
  description: string;
  difficultyThreshold: number;
  severity: "low" | "medium" | "high" | "critical";
  choices: Choice[];
  delayPenalty?: DelayPenalty;
}

export type GameStatus = "idle" | "running" | "decision" | "won" | "lost";

export interface GameState {
  status: GameStatus;
  day: number;
  users: number;
  payingUsers: number;
  money: number;
  mrr: number;
  dailyRevenue: number;
  dailyExpenses: number;
  dailyBalance: number;
  runwayDays: number | "profitable";
  conversionRate: number;
  arpu: number;
  dailyExpensesBreakdown: DailyExpensesBreakdown;
  dailyRevenueBreakdown: DailyRevenueBreakdown;
  performance: number;
  reputation: number;
  hype: number;
  techDebt: number;
  bugs: number;
  difficulty: number;
  currentEvent: GameEvent | null;
  pendingEffects: StatChange[] | null;
  usedEvents: string[];
  activeModifiers: ActiveModifier[];
  timeScale: number;
  timeAccumulator: number;
  lastPenaltyTime: number;
}

export const DAY_DURATION_MS = 6000;

const defaultExpensesBreakdown: DailyExpensesBreakdown = {
  base: 20,
  infrastructure: 5,
  techDebt: 0,
  bugs: 0,
  performance: 0,
  total: 25,
};

const defaultRevenueBreakdown: DailyRevenueBreakdown = {
  payingUsers: 2,
  conversionRate: 0.02,
  arpu: 29,
  mrr: 58,
  dailyRevenue: 1,
};

export const INITIAL_STATE: Omit<
  GameState,
  "status" | "difficulty" | "timeAccumulator"
> = {
  day: 1,
  users: 100,
  payingUsers: 2,
  money: 5000,
  mrr: 58,
  dailyRevenue: 1,
  dailyExpenses: 25,
  dailyBalance: -24,
  runwayDays: 208,
  conversionRate: 0.02,
  arpu: 29,
  dailyExpensesBreakdown: defaultExpensesBreakdown,
  dailyRevenueBreakdown: defaultRevenueBreakdown,
  performance: 80,
  reputation: 80,
  hype: 20,
  techDebt: 10,
  bugs: 0,
  currentEvent: null,
  pendingEffects: null,
  usedEvents: [],
  activeModifiers: [],
  timeScale: 1.0,
  lastPenaltyTime: 0,
};
