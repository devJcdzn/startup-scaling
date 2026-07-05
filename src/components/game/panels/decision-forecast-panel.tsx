"use client";

import React from "react";
import { formatCurrency, formatPercent } from "@/lib/formatters";

interface DecisionForecastPanelProps {
  effects: Record<string, number> | null;
  stats: {
    money: number;
    dailyBalance: number;
    performance: number;
    techDebt: number;
    bugs: number;
  };
}

export function DecisionForecastPanel({
  effects,
  stats,
}: DecisionForecastPanelProps) {
  if (!effects) {
    return (
      <div className="bg-[#121217] border border-[#1f1f29] rounded p-3 select-none flex flex-col items-center justify-center text-center text-slate-500 h-[110px]">
        <span className="text-[10px] font-bold uppercase tracking-wider mb-1 block">
          Decision Forecast
        </span>
        <p className="text-[9px]">Select or hover an action choice to preview strategic impact.</p>
      </div>
    );
  }

  // Calculate projected deltas
  const cashBefore = stats.money;
  const cashAfter = cashBefore + (effects.money || 0);

  const balanceBefore = stats.dailyBalance;
  // A rough estimate of MRR/daily balance adjustment based on choice effects
  const balanceAfter = balanceBefore + (effects.money ? Math.round(effects.money * 0.005) : 0);

  const stabilityBefore = stats.performance;
  const stabilityAfter = Math.max(0, Math.min(100, stabilityBefore + (effects.performance || 0)));

  const techDebtBefore = stats.techDebt;
  const techDebtAfter = Math.max(0, Math.min(100, techDebtBefore + (effects.techDebt || 0)));

  const formatDelta = (before: number, after: number, formatter: (n: number) => string) => {
    const isSame = before === after;
    if (isSame) return <span className="text-slate-400 font-bold">{formatter(before)}</span>;
    const isIncrease = after > before;
    const color = isIncrease ? "text-emerald-400" : "text-[#f43f5e]";
    return (
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="text-slate-500 line-through">{formatter(before)}</span>
        <span className="text-slate-400">→</span>
        <span className={`font-bold ${color}`}>{formatter(after)}</span>
      </div>
    );
  };

  return (
    <div className="bg-[#121217] border border-[#1f1f29] rounded p-3 select-none flex flex-col justify-between h-[110px] overflow-hidden">
      <div>
        <div className="border-b border-[#1f1f29] pb-1 mb-1.5 flex justify-between items-center">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
            Decision Forecast
          </span>
          <span className="text-[8px] text-[#10b981] font-bold uppercase font-mono">Telemetry</span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-[9px]">
          <div>
            <span className="text-slate-500 block">Cash</span>
            {formatDelta(cashBefore, cashAfter, formatCurrency)}
          </div>
          <div>
            <span className="text-slate-500 block">Stability</span>
            {formatDelta(stabilityBefore, stabilityAfter, (n) => `${n}%`)}
          </div>
          <div>
            <span className="text-slate-500 block">Burn</span>
            {formatDelta(balanceBefore, balanceAfter, (n) => `${n >= 0 ? "+" : ""}${formatCurrency(n)}/d`)}
          </div>
          <div>
            <span className="text-slate-500 block">Tech Debt</span>
            {formatDelta(techDebtBefore, techDebtAfter, (n) => `${n}%`)}
          </div>
        </div>
      </div>
    </div>
  );
}
