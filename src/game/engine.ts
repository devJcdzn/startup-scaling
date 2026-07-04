import type { GameState, StatChange } from "./types";
import { INITIAL_STATE, DAY_DURATION_MS } from "./types";
import { mulberry32, rngInt } from "./rng";
import { calculateNewUsers, calculateGrowthMultiplier } from "./growth";
import { calculateDifficulty } from "./difficulty";
import { selectEvent } from "./events";
import { checkWin, checkLoss, checkDeadlineLoss } from "./conditions";
import { calculateEconomy } from "./economy";
import { applyActiveModifiers } from "./modifiers/apply-modifiers";
import { expireModifiers } from "./modifiers/expire-modifiers";
import eventsData from "./data/events.json";

let rng = mulberry32(42);

export function reseedRng(seed: number): void {
  rng = mulberry32(seed);
}

export function createInitialState(seed: number): GameState {
  reseedRng(seed);
  return {
    ...INITIAL_STATE,
    status: "idle",
    difficulty: calculateDifficulty(INITIAL_STATE.users),
    timeAccumulator: 0,
  };
}

function clampStats(state: GameState): GameState {
  return {
    ...state,
    users: Math.max(0, state.users),
    money: Math.max(0, state.money),
    performance: Math.max(0, Math.min(100, state.performance)),
    reputation: Math.max(0, Math.min(100, state.reputation)),
    hype: Math.max(0, Math.min(100, state.hype)),
    techDebt: Math.max(0, Math.min(100, state.techDebt)),
    bugs: Math.max(0, Math.min(100, state.bugs)),
  };
}

function applyDailyEffects(state: GameState): GameState {
  let next = { ...state };

  if (next.techDebt >= 80) next.performance -= 4;
  else if (next.techDebt >= 60) next.performance -= 2;
  else if (next.techDebt >= 30) next.performance -= 1;

  if (next.users >= 1_000_000) next.performance -= 6;
  else if (next.users >= 500_000) next.performance -= 4;
  else if (next.users >= 100_000) next.performance -= 2;
  else if (next.users >= 10_000) next.performance -= 1;

  if (next.performance <= 20) next.reputation -= 4;
  else if (next.performance <= 40) next.reputation -= 2;
  else if (next.performance <= 60) next.reputation -= 1;

  if (next.bugs >= 60) next.reputation -= 4;
  else if (next.bugs >= 40) next.reputation -= 2;
  else if (next.bugs >= 20) next.reputation -= 1;

  if (next.techDebt >= 80) next.bugs += 2;
  else if (next.techDebt >= 50) next.bugs += 1;

  return next;
}

function applyGrowth(state: GameState): GameState {
  const multiplier = calculateGrowthMultiplier(state.reputation, state.hype);
  const newUsers = calculateNewUsers(state.users, state.hype, rng, multiplier);
  return { ...state, users: state.users + newUsers };
}

function applyEconomy(state: GameState): GameState {
  const economy = calculateEconomy(state);
  return {
    ...state,
    money: state.money + economy.dailyBalance,
    payingUsers: economy.payingUsers,
    mrr: economy.mrr,
    dailyRevenue: economy.dailyRevenue,
    dailyExpenses: economy.dailyExpenses,
    dailyBalance: economy.dailyBalance,
    runwayDays: economy.runwayDays,
    conversionRate: economy.conversionRate,
    arpu: economy.arpu,
    dailyExpensesBreakdown: economy.dailyExpensesBreakdown,
    dailyRevenueBreakdown: economy.dailyRevenueBreakdown,
  };
}

function applyDelayPenalty(state: GameState, now: number): GameState {
  if (!state.currentEvent?.delayPenalty) return state;
  if (state.lastPenaltyTime === 0) return { ...state, lastPenaltyTime: now };

  const elapsed = now - state.lastPenaltyTime;
  if (elapsed < state.currentEvent.delayPenalty.intervalMs) return state;

  let next = { ...state };
  const effects = state.currentEvent.delayPenalty.effects;
  for (const key of Object.keys(effects) as Array<keyof typeof effects>) {
    const val = effects[key];
    if (val !== undefined) {
      (next as any)[key] = (next as any)[key] + val;
    }
  }
  next.lastPenaltyTime = now;
  return clampStats(next);
}

export function tick(state: GameState, now: number): GameState {
  if (state.status !== "running" && state.status !== "decision") return state;

  let next = applyDelayPenalty(state, now);

  next = applyGrowth(next);
  next = applyActiveModifiers(next, next.activeModifiers);
  next = applyDailyEffects(next);
  next = applyEconomy(next);
  next.difficulty = calculateDifficulty(next.users);

  next.activeModifiers = expireModifiers(next.activeModifiers, next.day);

  if (next.difficulty > 0.3 && !next.currentEvent) {
    const shouldTrigger = rngInt(rng, 1, 100) <= 45;
    if (shouldTrigger) {
      const event = selectEvent(
        eventsData as any[],
        next.difficulty,
        rng,
        next.usedEvents
      );
      if (event) {
        next.currentEvent = event;
        next.timeScale = 0.25;
        next.status = "decision";
        next.lastPenaltyTime = now;
      }
    }
  }

  if (checkWin(next.day, next.users, next.money, next.performance, next.reputation)) {
    next.status = "won";
  } else if (checkLoss(next.money, next.performance, next.reputation)) {
    next.status = "lost";
  } else if (checkDeadlineLoss(next.day, next.users)) {
    next.status = "lost";
  }

  return clampStats(next);
}

export function advanceDay(state: GameState): GameState {
  if (state.status !== "running" && state.status !== "decision") return state;
  return { ...state, day: state.day + 1 };
}

export function applyChoice(
  state: GameState,
  choiceIndex: number
): GameState {
  if (!state.currentEvent) return state;

  const choice = state.currentEvent.choices[choiceIndex];
  if (!choice) return state;

  let next: GameState = {
    ...state,
    users: state.users + (choice.effects.users ?? 0),
    money: state.money + (choice.effects.money ?? 0),
    performance: state.performance + (choice.effects.performance ?? 0),
    reputation: state.reputation + (choice.effects.reputation ?? 0),
    hype: state.hype + (choice.effects.hype ?? 0),
    techDebt: state.techDebt + (choice.effects.techDebt ?? 0),
    bugs: state.bugs + (choice.effects.bugs ?? 0),
    usedEvents: [...state.usedEvents, state.currentEvent.id],
    currentEvent: null,
    pendingEffects: [{ ...choice.effects }],
    timeScale: 1.0,
    lastPenaltyTime: 0,
    status: "running",
  };

  if (choice.impact?.modifiers) {
    next.activeModifiers = [
      ...next.activeModifiers,
      ...choice.impact.modifiers.map((m) => ({
        ...m,
        startedAtDay: state.day,
      })),
    ];
  }

  next.difficulty = calculateDifficulty(next.users);

  return clampStats(next);
}
