"use client";

import React from "react";
import { CircleCheck, X } from "lucide-react";

interface HowToPlayDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlayDialog({ isOpen, onClose }: HowToPlayDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#121217] border border-[#1f1f29] rounded-md max-w-md w-full overflow-hidden shadow-2xl font-mono text-xs flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-[#1f1f29] bg-[#0b0b0f]">
          <span className="font-bold text-white uppercase tracking-wider">How to Play</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 text-slate-300 leading-relaxed max-h-[400px] overflow-y-auto scroller">
          <p>
            You have <strong className="text-white">30 days</strong> to scale your SaaS to escape velocity.
          </p>

          <div className="border border-[#1f1f29] bg-[#0b0b0f] p-2.5 rounded space-y-1">
            <div className="font-bold text-[#10b981] uppercase text-[9px] tracking-wider mb-1">Winning Condition:</div>
            <p className="text-[10px]">Reach <strong className="text-white">1,000,000 active users</strong> by Day 30.</p>
          </div>

          <div className="border border-[#1f1f29] bg-[#0b0b0f] p-2.5 rounded space-y-1">
            <div className="font-bold text-[#f43f5e] uppercase text-[9px] tracking-wider mb-1">Losing Conditions:</div>
            <p className="text-[10px]">Fail if <strong className="text-white">Cash Balance</strong>, <strong className="text-white">Stability</strong>, or <strong className="text-white">Reputation</strong> reaches 0%.</p>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="font-bold text-white uppercase text-[9px] tracking-wider">Metrics Overview:</div>
            <ul className="space-y-1 text-[10px] pl-1.5">
              <li>• <strong>Cash Balance:</strong> Capital available. Negative balances burn cash.</li>
              <li>• <strong>MRR:</strong> Recurring monthly revenue driven by subscribers.</li>
              <li>• <strong>Stability:</strong> Platform uptime reliability. Degrades user trust.</li>
              <li>• <strong>Reputation:</strong> Brand trust. Lower reputation speeds churn.</li>
              <li>• <strong>Tech Debt:</strong> Accumulated shortcuts that decay Stability.</li>
            </ul>
          </div>

          <p className="text-[10px] text-slate-400 border-t border-[#1f1f29]/30 pt-2 mt-2">
            Strategic decisions will prompt choices. High-impact selections might require authorization. Buffs and debuffs apply persistency to daily counts.
          </p>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[#1f1f29] bg-[#0b0b0f] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#10b981] hover:bg-[#10b981]/90 text-[#0b0b0f] font-bold uppercase rounded cursor-pointer text-[10px]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
