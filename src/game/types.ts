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
  effects: StatChange;
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
  money: number;
  performance: number;
  reputation: number;
  hype: number;
  techDebt: number;
  bugs: number;
  difficulty: number;
  currentEvent: GameEvent | null;
  pendingEffects: StatChange[] | null;
  usedEvents: string[];
  timeScale: number;
  timeAccumulator: number;
  lastPenaltyTime: number;
}

export const DAY_DURATION_MS = 6000;

export const INITIAL_STATE: Omit<
  GameState,
  "status" | "difficulty" | "timeAccumulator"
> = {
  day: 1,
  users: 100,
  money: 1000,
  performance: 80,
  reputation: 80,
  hype: 20,
  techDebt: 10,
  bugs: 0,
  currentEvent: null,
  pendingEffects: null,
  usedEvents: [],
  timeScale: 1.0,
  lastPenaltyTime: 0,
};
