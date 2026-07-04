export interface ModifierEffect {
  stat?: string;
  value: number;
  mode: "flat" | "percent" | "multiplier" | "risk";
  interval?: "day";
  label: string;
}

export interface ActiveModifier {
  id: string;
  label: string;
  description: string;
  source: string;
  type: "buff" | "debuff" | "mixed";
  category:
    | "infrastructure"
    | "product"
    | "growth"
    | "finance"
    | "security"
    | "reputation";
  durationDays?: number;
  startedAtDay: number;
  effects: ModifierEffect[];
}
