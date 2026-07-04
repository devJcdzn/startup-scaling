"use client";

import React from "react";

interface ImpactChipProps {
  metric: string;
  value: number;
}

export function ImpactChip({ metric, value }: ImpactChipProps) {
  if (value === 0) return null;

  const isGood = (() => {
    // positive is bad for bugs / techDebt
    if (metric === "bugs" || metric === "techDebt") {
      return value < 0;
    }
    return value > 0;
  })();

  const sign = value > 0 ? "+" : "";
  const label = metric
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase());

  const colorClass = isGood ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" : "text-[#f43f5e] bg-[#f43f5e]/10 border-[#f43f5e]/30";

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border ${colorClass} shrink-0`}>
      {sign}{value} {label}
    </span>
  );
}
