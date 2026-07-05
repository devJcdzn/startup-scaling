import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import type { GameState, GameStatus } from "../types";
import {
  createInitialState,
  tick as engineTick,
  applyChoice,
  advanceDay,
  reseedRng,
} from "../engine";
import type { GrowthAction, CampaignResult } from "../growth/campaigns";
import { runGrowthCampaign } from "../growth/outcome";

interface ActivityLogEntry {
  day: number;
  type: "event" | "decision" | "economy" | "warning" | "critical" | "campaign";
  message: string;
}

interface GameStore extends GameState {
  newUsersToday: number;
  lastDailyBalance: number;
  activityLogs: ActivityLogEntry[];
  lastCampaignResult: CampaignResult | null;
  startGame: () => void;
  tick: (now: number) => void;
  choose: (choiceIndex: number) => void;
  runCampaign: (action: GrowthAction) => CampaignResult | null;
  restart: () => void;
  dismissFeedback: () => void;
  dismissCampaignResult: () => void;
  applyDelayPenaltyIfDue: (now: number) => void;
  addLog: (type: ActivityLogEntry["type"], message: string) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(Date.now()),
  newUsersToday: 0,
  lastDailyBalance: 0,
  activityLogs: [],
  lastCampaignResult: null,

  addLog: (type, message) => {
    const state = get();
    const entry: ActivityLogEntry = { day: state.day, type, message };
    set({ activityLogs: [...state.activityLogs.slice(-49), entry] });
  },

  startGame: () => {
    const state = createInitialState(Date.now());
    set({
      ...state,
      status: "running",
      activityLogs: [],
      newUsersToday: 0,
      lastDailyBalance: 0,
    });
  },

  tick: (now: number) => {
    const state = get();
    if (state.status !== "running" && state.status !== "decision") return;

    const prevUsers = state.users;
    let next = engineTick(state, now);

    const logs = [...state.activityLogs.slice(-49)];

    if (next.currentEvent && next.currentEvent.id !== state.currentEvent?.id) {
      logs.push({ day: next.day, type: "event", message: next.currentEvent.title });
    }

    if (next.dailyBalance !== state.dailyBalance) {
      const sign = next.dailyBalance >= 0 ? "+" : "";
      logs.push({
        day: next.day,
        type: "economy",
        message: `Revenue +$${next.dailyRevenue}, Expenses -$${next.dailyExpenses}, Balance ${sign}$${Math.abs(next.dailyBalance)}`,
      });
    }

    if (next.status === "running" || next.status === "decision") {
      next = advanceDay(next);
    }

    set({
      ...next,
      newUsersToday: next.users - prevUsers,
      lastDailyBalance: next.dailyBalance,
      activityLogs: logs,
    });
  },

  choose: (choiceIndex: number) => {
    const state = get();
    if (!state.currentEvent) return;

    const choice = state.currentEvent.choices[choiceIndex];
    const logs = [...state.activityLogs.slice(-49)];
    logs.push({ day: state.day, type: "decision", message: `Chose: ${choice.text}` });

    const next = applyChoice(state, choiceIndex);
    set({ ...next, activityLogs: logs });
  },

  runCampaign: (action: GrowthAction) => {
    const state = get();
    if (state.money < action.cost) return null;
    if (state.status !== "running" && state.status !== "decision") return null;

    const result = runGrowthCampaign(state, action);
    const logs = [...state.activityLogs.slice(-49)];

    let next: GameState = {
      ...state,
      money: state.money - action.cost,
      users: state.users + result.acquiredUsers,
    };

    if (result.outcome === "backfire") {
      next.performance = Math.max(0, next.performance - 8);
      next.reputation = Math.max(0, next.reputation - 5);
      next.bugs = Math.min(100, next.bugs + 5);
    } else if (result.outcome === "failure") {
      next.performance = Math.max(0, next.performance - 3);
    }

    logs.push({
      day: state.day,
      type: "campaign",
      message: `${action.label}: ${result.outcome} (+${result.acquiredUsers} users, CAC $${Math.round(result.cac)})`,
    });

    set({
      ...next,
      lastCampaignResult: result,
      activityLogs: logs,
    });

    return result;
  },

  dismissCampaignResult: () => set({ lastCampaignResult: null }),

  restart: () => {
    const state = createInitialState(Date.now());
    set({ ...state, status: "running", activityLogs: [], newUsersToday: 0, lastDailyBalance: 0, lastCampaignResult: null });
  },

  dismissFeedback: () => set({ pendingEffects: null }),

  applyDelayPenaltyIfDue: (now: number) => {
    const state = get();
    if (!state.currentEvent?.delayPenalty) return;
    if (state.lastPenaltyTime === 0) {
      set({ lastPenaltyTime: now });
      return;
    }

    const elapsed = now - state.lastPenaltyTime;
    if (elapsed < state.currentEvent.delayPenalty.intervalMs) return;

    let next = { ...state };
    const effects = state.currentEvent.delayPenalty.effects;
    for (const key of Object.keys(effects) as Array<keyof typeof effects>) {
      const val = effects[key];
      if (val !== undefined) {
        (next as any)[key] = (next as any)[key] + val;
      }
    }
    next.lastPenaltyTime = now;

    next.performance = Math.max(0, Math.min(100, next.performance));
    next.reputation = Math.max(0, Math.min(100, next.reputation));
    next.hype = Math.max(0, Math.min(100, next.hype));
    next.techDebt = Math.max(0, Math.min(100, next.techDebt));
    next.bugs = Math.max(0, Math.min(100, next.bugs));
    next.users = Math.max(0, next.users);
    next.money = Math.max(0, next.money);

    if (next.money <= 0 || next.performance <= 0 || next.reputation <= 0) {
      next.status = "lost";
    }

    set(next);
  },
}));

export function useGameStatus(): GameStatus {
  return useGameStore((s) => s.status);
}

export function useGameStats() {
  return useGameStore(
    useShallow((s) => ({
      day: s.day,
      users: s.users,
      payingUsers: s.payingUsers,
      money: s.money,
      mrr: s.mrr,
      dailyRevenue: s.dailyRevenue,
      dailyExpenses: s.dailyExpenses,
      dailyBalance: s.dailyBalance,
      runwayDays: s.runwayDays,
      conversionRate: s.conversionRate,
      arpu: s.arpu,
      cac: s.cac,
      acquisitionReadiness: s.acquisitionReadiness,
      dailyExpensesBreakdown: s.dailyExpensesBreakdown,
      dailyRevenueBreakdown: s.dailyRevenueBreakdown,
      performance: s.performance,
      reputation: s.reputation,
      hype: s.hype,
      techDebt: s.techDebt,
      bugs: s.bugs,
      difficulty: s.difficulty,
      timeScale: s.timeScale,
      newUsersToday: s.newUsersToday,
    }))
  );
}

export function useGameEvent() {
  return useGameStore(
    useShallow((s) => ({
      currentEvent: s.currentEvent,
      pendingEffects: s.pendingEffects,
      lastPenaltyTime: s.lastPenaltyTime,
    }))
  );
}
