"use client";

import React from "react";
import { ShieldAlert, AlertCircle } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/formatters";

interface Choice {
  text: string;
  effects: Record<string, number>;
}

interface ConfirmDecisionDialogProps {
  isOpen: boolean;
  choice: Choice | null;
  isCritical: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  stats: {
    money: number;
    dailyBalance: number;
    performance: number;
    techDebt: number;
    bugs: number;
  };
}

export function ConfirmDecisionDialog({
  isOpen,
  choice,
  isCritical,
  onCancel,
  onConfirm,
  stats,
}: ConfirmDecisionDialogProps) {
  if (!isOpen || !choice) return null;

  // Calculate projected deltas
  const cashBefore = stats.money;
  const cashAfter = cashBefore + (choice.effects.money || 0);

  const balanceBefore = stats.dailyBalance;
  const balanceAfter = balanceBefore + (choice.effects.money ? Math.round(choice.effects.money * 0.005) : 0);

  const stabilityBefore = stats.performance;
  const stabilityAfter = Math.max(0, Math.min(100, stabilityBefore + (choice.effects.performance || 0)));

  const techDebtBefore = stats.techDebt;
  const techDebtAfter = Math.max(0, Math.min(100, techDebtBefore + (choice.effects.techDebt || 0)));

  const bugsBefore = stats.bugs;
  const bugsAfter = Math.max(0, bugsBefore + (choice.effects.bugs || 0));

  const formatDelta = (before: number, after: number, formatter: (n: number) => string) => {
    const isSame = before === after;
    if (isSame) return <span className="text-slate-400 font-bold">{formatter(before)}</span>;
    const isIncrease = after > before;
    const color = isIncrease ? "text-emerald-400" : "text-[#f43f5e]";
    return (
      <div className="flex items-center gap-1">
        <span className="text-slate-500 font-medium line-through">{formatter(before)}</span>
        <span className="text-slate-400">→</span>
        <span className={`font-bold ${color}`}>{formatter(after)}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#121217] border border-[#1f1f29] rounded-md max-w-md w-full overflow-hidden shadow-2xl font-mono text-xs flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1f1f29] bg-[#0b0b0f]">
          {isCritical ? (
            <ShieldAlert className="size-4 text-[#f43f5e]" />
          ) : (
            <AlertCircle className="size-4 text-amber-500" />
          )}
          <span className="font-bold text-white uppercase tracking-wider">
            {isCritical ? "Confirm Critical Decision" : "Confirm Action Request"}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="bg-[#0b0b0f] border border-[#1f1f29] p-3 rounded space-y-1.5">
            <span className="text-white font-bold uppercase block tracking-wide text-center">
              {choice.text}
            </span>
            <p className="text-[10px] text-slate-400 leading-relaxed text-center">
              This decision carries long-term consequences that will dynamically adjust your startup parameters.
            </p>
          </div>

          {/* Decision Forecast Grid */}
          <div className="space-y-2">
            <span className="text-slate-500 uppercase text-[9px] font-bold block tracking-wider">
              Projected Metrics Impact:
            </span>
            <div className="bg-[#0b0b0f] border border-[#1f1f29] p-3 rounded space-y-2 text-[10px]">
              <div className="flex justify-between border-b border-[#1f1f29]/30 pb-1">
                <span className="text-slate-400">Cash Reserve:</span>
                {formatDelta(cashBefore, cashAfter, formatCurrency)}
              </div>
              <div className="flex justify-between border-b border-[#1f1f29]/30 pb-1">
                <span className="text-slate-400">Daily Cashflow:</span>
                {formatDelta(balanceBefore, balanceAfter, (n) => `${n >= 0 ? "+" : ""}${formatCurrency(n)}/d`)}
              </div>
              <div className="flex justify-between border-b border-[#1f1f29]/30 pb-1">
                <span className="text-slate-400">Stability:</span>
                {formatDelta(stabilityBefore, stabilityAfter, formatPercent)}
              </div>
              <div className="flex justify-between border-b border-[#1f1f29]/30 pb-1">
                <span className="text-slate-400">Technical Debt:</span>
                {formatDelta(techDebtBefore, techDebtAfter, formatPercent)}
              </div>
              <div className="flex justify-between border-b border-[#1f1f29]/30 pb-1">
                <span className="text-slate-400">Backlog Bugs:</span>
                {formatDelta(bugsBefore, bugsAfter, (n) => `${n} bugs`)}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 py-2.5 border-t border-[#1f1f29] bg-[#0b0b0f] flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 border border-[#1f1f29] hover:bg-[#1a1a24] text-slate-400 hover:text-white font-bold uppercase rounded cursor-pointer text-[10px]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-1.5 font-bold uppercase rounded cursor-pointer text-[10px] ${
              isCritical
                ? "bg-[#f43f5e] hover:bg-[#f43f5e]/90 text-white"
                : "bg-[#10b981] hover:bg-[#10b981]/90 text-[#0b0b0f]"
            }`}
          >
            {isCritical ? "Confirm Critical Decision" : "Confirm Decision"}
          </button>
        </div>
      </div>
    </div>
  );
}
