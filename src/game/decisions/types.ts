import type { ActiveModifier } from "../modifiers/types";

export interface ImmediateEffect {
  stat: string;
  value: number;
  label?: string;
}

export interface RecurringEffect {
  stat: string;
  value: number;
  interval: "day";
  durationDays?: number;
  label?: string;
}

export interface RiskEffect {
  risk: string;
  value: number;
  label?: string;
}

export interface DecisionImpact {
  immediate: ImmediateEffect[];
  recurring?: RecurringEffect[];
  risks?: RiskEffect[];
  modifiers?: ActiveModifier[];
}

export interface ForecastItem {
  label: string;
  before: string;
  after: string;
  direction: "up" | "down" | "neutral";
  meaning: "good" | "bad" | "mixed" | "neutral";
}

export interface DecisionForecast {
  title: string;
  summary: string;
  items: ForecastItem[];
}
