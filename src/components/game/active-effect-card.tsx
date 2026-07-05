"use client";

import type { ActiveModifier } from "@/game/modifiers/types";

interface ActiveEffectCardProps {
  modifier: ActiveModifier;
  currentDay: number;
}

const TYPE_STYLES: Record<string, { bg: string; border: string; label: string }> = {
  buff: { bg: "bg-[#22c55e]/5", border: "border-[#22c55e]/20", label: "BUFF" },
  debuff: { bg: "bg-[#ef4444]/5", border: "border-[#ef4444]/20", label: "DEBUFF" },
  mixed: { bg: "bg-[#f59e0b]/5", border: "border-[#f59e0b]/20", label: "MIXED" },
};

export function ActiveEffectCard({ modifier, currentDay }: ActiveEffectCardProps) {
  const style = TYPE_STYLES[modifier.type] ?? TYPE_STYLES.mixed;
  const age = currentDay - modifier.startedAtDay;
  const remaining = modifier.durationDays !== undefined ? modifier.durationDays - age : null;

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-2.5 space-y-1.5`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[9px] font-bold px-1 py-0.5 rounded ${
              modifier.type === "buff"
                ? "bg-[#22c55e]/20 text-[#22c55e]"
                : modifier.type === "debuff"
                  ? "bg-[#ef4444]/20 text-[#ef4444]"
                  : "bg-[#f59e0b]/20 text-[#f59e0b]"
            }`}
          >
            {style.label}
          </span>
          <span className="text-xs font-medium text-[#fafafa]">
            {modifier.label}
          </span>
        </div>
        {remaining !== null && (
          <span className="text-[10px] text-[#a1a1aa]">
            {remaining}d left
          </span>
        )}
      </div>
      <div className="space-y-0.5">
        {modifier.effects.map((effect, i) => (
          <div key={i} className="text-[10px] text-[#a1a1aa]">
            {effect.label}
          </div>
        ))}
      </div>
    </div>
  );
}
