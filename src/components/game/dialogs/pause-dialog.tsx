"use client";

import React from "react";
import { Play, RotateCcw, LogOut } from "lucide-react";
import { formatCurrency, formatCompactNumber } from "@/lib/formatters";

interface PauseDialogProps {
  isOpen: boolean;
  day: number;
  users: number;
  cash: number;
  mrr: number;
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
}

export function PauseDialog({
  isOpen,
  day,
  users,
  cash,
  mrr,
  onResume,
  onRestart,
  onMainMenu,
}: PauseDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#121217] border border-[#1f1f29] rounded-md max-w-sm w-full overflow-hidden shadow-2xl font-mono text-xs flex flex-col">
        {/* Header */}
        <div className="px-4 py-2 border-b border-[#1f1f29] bg-[#0b0b0f] text-center">
          <span className="font-bold text-white uppercase tracking-wider text-sm block">
            Game Paused
          </span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="bg-[#0b0b0f] border border-[#1f1f29] p-3 rounded space-y-2">
            <span className="text-slate-500 uppercase text-[9px] font-bold block border-b border-[#1f1f29] pb-1">
              Current Run Progress
            </span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Day:</span>
                <span className="text-white font-bold">{day} / 30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Users:</span>
                <span className="text-white font-bold">{formatCompactNumber(users)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cash:</span>
                <span className="text-white font-bold">{formatCurrency(cash)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">MRR:</span>
                <span className="text-white font-bold">{formatCurrency(mrr)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={onResume}
              className="w-full py-2 bg-[#10b981] hover:bg-[#10b981]/90 text-[#0b0b0f] font-bold uppercase rounded cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="size-3.5 fill-current" />
              Resume Run
            </button>
            <button
              onClick={onRestart}
              className="w-full py-2 border border-[#1f1f29] hover:bg-[#1a1a24] text-white font-bold uppercase rounded cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="size-3.5" />
              Restart Run
            </button>
            <button
              onClick={onMainMenu}
              className="w-full py-2 border border-[#f43f5e]/30 hover:bg-[#f43f5e]/5 text-[#f43f5e] font-bold uppercase rounded cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="size-3.5" />
              Quit to Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
