"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface RestartRunDialogProps {
  isOpen: boolean;
  day: number;
  users: number;
  cash: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export function RestartRunDialog({
  isOpen,
  day,
  users,
  cash,
  onCancel,
  onConfirm,
}: RestartRunDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#121217] border border-[#1f1f29] rounded-md max-w-sm w-full overflow-hidden shadow-2xl font-mono text-xs flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1f1f29] bg-[#0b0b0f]">
          <AlertTriangle className="size-4 text-amber-500" />
          <span className="font-bold text-white uppercase tracking-wider">
            Restart Current Run?
          </span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 text-slate-300">
          <p className="leading-relaxed">
            Your current run progress will be permanently lost. Are you sure you want to initialize a new company?
          </p>

          <div className="bg-[#0b0b0f] border border-[#1f1f29] p-3 rounded text-[10px] space-y-1.5">
            <div className="flex justify-between">
              <span>Day:</span>
              <span className="text-white font-bold">{day} / 30</span>
            </div>
            <div className="flex justify-between">
              <span>Users:</span>
              <span className="text-white font-bold">{users.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Cash:</span>
              <span className="text-white font-bold">{formatCurrency(cash)}</span>
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
            className="px-4 py-1.5 bg-[#f43f5e] hover:bg-[#f43f5e]/90 text-white font-bold uppercase rounded cursor-pointer text-[10px]"
          >
            Restart Run
          </button>
        </div>
      </div>
    </div>
  );
}
