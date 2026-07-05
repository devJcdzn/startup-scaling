"use client";

import React from "react";
import { Sparkles, TrendingDown, EyeOff } from "lucide-react";
import { useGameStore } from "@/game/store/game-store";

interface ActiveEffectsPanelProps {
  stats: {
    techDebt: number;
    users: number;
    performance: number;
    bugs: number;
    reputation: number;
  };
}

interface EffectItem {
  type: "buff" | "debuff" | "neutral";
  label: string;
  desc: string;
  remaining?: number;
}

export function ActiveEffectsPanel({ stats }: ActiveEffectsPanelProps) {
  const modifiers = useGameStore((s) => s.activeModifiers);
  const day = useGameStore((s) => s.day);
  const effects: EffectItem[] = [];

  // 1. Show modifiers from decisions
  for (const mod of modifiers) {
    const remaining = mod.durationDays !== undefined ? mod.durationDays - (day - mod.startedAtDay) : undefined;
    effects.push({
      type: mod.type === "buff" ? "buff" : mod.type === "debuff" ? "debuff" : "neutral",
      label: mod.label,
      desc: mod.effects.map((e) => e.label).join(" · "),
      remaining,
    });
  }

  // 2. Tech Debt Overheads
  if (stats.techDebt >= 80) {
    effects.push({
      type: "debuff",
      label: "Critical Tech Debt",
      desc: "-4% Stability/day · +2 Bugs/day",
    });
  } else if (stats.techDebt >= 60) {
    effects.push({
      type: "debuff",
      label: "Heavy Tech Debt",
      desc: "-2% Stability/day · +1 Bug/day",
    });
  } else if (stats.techDebt >= 30) {
    effects.push({
      type: "debuff",
      label: "Active Tech Debt",
      desc: "-1% Stability/day",
    });
  }

  // 3. Scaling Load Overheads
  if (stats.users >= 1_000_000) {
    effects.push({
      type: "debuff",
      label: "Scale Strain (1M+ Users)",
      desc: "-6% Stability/day overhead",
    });
  } else if (stats.users >= 500_000) {
    effects.push({
      type: "debuff",
      label: "Scale Strain (500k+ Users)",
      desc: "-4% Stability/day overhead",
    });
  } else if (stats.users >= 100_000) {
    effects.push({
      type: "debuff",
      label: "Scale Strain (100k+ Users)",
      desc: "-2% Stability/day overhead",
    });
  } else if (stats.users >= 10_000) {
    effects.push({
      type: "debuff",
      label: "Scale Strain (10k+ Users)",
      desc: "-1% Stability/day overhead",
    });
  }

  // 4. Stability Uptime Debuffs
  if (stats.performance <= 20) {
    effects.push({
      type: "debuff",
      label: "Critical System Downtime",
      desc: "-4 Reputation/day",
    });
  } else if (stats.performance <= 40) {
    effects.push({
      type: "debuff",
      label: "Moderate Outage Issues",
      desc: "-2 Reputation/day",
    });
  } else if (stats.performance <= 60) {
    effects.push({
      type: "debuff",
      label: "Micro-Outages",
      desc: "-1 Reputation/day",
    });
  }

  // 5. Bugs Backlog Debuffs
  if (stats.bugs >= 60) {
    effects.push({
      type: "debuff",
      label: "Backlog Overflow",
      desc: "-4 Reputation/day",
    });
  } else if (stats.bugs >= 40) {
    effects.push({
      type: "debuff",
      label: "Heavy Bug backlog",
      desc: "-2 Reputation/day",
    });
  } else if (stats.bugs >= 20) {
    effects.push({
      type: "debuff",
      label: "Minor Bug backlog",
      desc: "-1 Reputation/day",
    });
  }

  // 6. High Reputation Buffs
  if (stats.reputation >= 80) {
    effects.push({
      type: "buff",
      label: "High Brand Trust",
      desc: "Increased organic conversions · reduced churn",
    });
  } else if (stats.reputation < 50) {
    effects.push({
      type: "debuff",
      label: "Brand Trust Deficit",
      desc: "Accelerated user churn risk",
    });
  }

  // Sort: Debuffs first, then Buffs
  const debuffs = effects.filter((e) => e.type === "debuff");
  const buffs = effects.filter((e) => e.type === "buff");

  const visibleEffects = [...debuffs, ...buffs].slice(0, 3);
  const hiddenCount = effects.length - visibleEffects.length;

  return (
    <div className="bg-[#121217] border border-[#1f1f29] rounded p-3 select-none flex flex-col justify-between h-[120px] overflow-hidden">
      <div>
        <div className="border-b border-[#1f1f29] pb-1 mb-1.5 flex justify-between items-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Active Effects
          </span>
          <span className="text-[8px] text-[#10b981] font-bold uppercase font-mono">Modifiers</span>
        </div>

        {effects.length === 0 ? (
          <div className="text-center py-2 text-slate-500 flex flex-col items-center justify-center gap-0.5">
            <EyeOff className="size-3.5 text-slate-600 animate-pulse" />
            <span className="text-[8px] font-bold uppercase tracking-wider">No Active Effects</span>
          </div>
        ) : (
          <div className="space-y-1 pr-1">
            {visibleEffects.map((eff, i) => (
              <div
                key={i}
                className={`flex gap-1.5 items-center px-1.5 py-0.5 rounded text-[8px] border ${
                  eff.type === "buff"
                    ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400"
                    : "bg-[#f43f5e]/5 border-[#f43f5e]/10 text-[#f43f5e]"
                }`}
              >
                {eff.type === "buff" ? (
                  <Sparkles className="size-2.5 shrink-0" />
                ) : (
                  <TrendingDown className="size-2.5 shrink-0" />
                )}
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="font-bold truncate max-w-[120px] uppercase tracking-wide">{eff.label}</span>
                  <span className="truncate opacity-80 text-[8px] ml-1.5">{eff.desc}</span>
                </div>
              </div>
            ))}
            {hiddenCount > 0 && (
              <span className="block text-[8px] text-slate-500 text-right font-mono">
                + {hiddenCount} more effects
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
