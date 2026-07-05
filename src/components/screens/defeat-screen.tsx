"use client";

import { useGameStore, useGameStats } from "@/game/store/game-store";
import { useSound } from "@/hooks/use-sound";
import { useEffect, useState } from "react";
import { formatCurrency, formatCompactNumber } from "@/lib/formatters";
import { AlertOctagon, Share2 } from "lucide-react";

export function DefeatScreen() {
  const restart = useGameStore((s) => s.restart);
  const stats = useGameStats();
  const { playClick } = useSound();
  const [copied, setCopied] = useState(false);

  // Determine defeat cause
  const getDefeatCause = () => {
    if (stats.money <= 0) return { title: "Ran out of cash", desc: "Your operating costs and penalty bills drained liquid capital reserves.", main: "Cash balance hit zero." };
    if (stats.performance <= 0) return { title: "Product collapsed", desc: "Critical platform instability drove service downtime past recovery.", main: "Stability hit zero." };
    if (stats.reputation <= 0) return { title: "Users lost trust", desc: "Negative security incidents and bad service quality destroyed market reputation.", main: "Reputation hit zero." };
    return { title: "Failed to scale", desc: "You reached day 30, but could not capture the targeted 1M active customers.", main: "Insufficient market scale." };
  };

  const cause = getDefeatCause();

  // Grade calculation
  const getGrade = () => {
    if (stats.day >= 25) return "D";
    if (stats.day >= 15) return "F+";
    return "F";
  };

  const finalGrade = getGrade();

  useEffect(() => {
    // Save last run telemetry
    const lastRunSummary = {
      day: stats.day,
      result: "lost",
      cause: cause.title,
      users: stats.users,
    };
    localStorage.setItem("bos-last-run", JSON.stringify(lastRunSummary));
  }, [stats.day, cause.title, stats.users]);

  const handleShare = () => {
    playClick();
    const text = `Battle of Scaling — Run Summary\n\nResult: Defeat 💀\nSurvived: ${stats.day}/30 Days\nPeak Users: ${formatCompactNumber(stats.users)}\nFailure Cause: ${cause.title}\nGrade: ${finalGrade}\n\nScale your SaaS at Battle of Scaling!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-6 bg-[#0b0b0f] font-mono text-[#f3f4f6] select-none overflow-hidden">
      <div className="w-full max-w-md bg-[#121217] border border-[#1f1f29] rounded p-5 space-y-4 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="text-[9px] text-[#f43f5e] font-bold uppercase tracking-widest flex items-center justify-center gap-1">
            <AlertOctagon className="size-3 text-[#f43f5e]" />
            Run Failed
          </div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">
            Game Over: Startup Failed
          </h1>
          <p className="text-[10px] text-slate-400">
            {cause.desc}
          </p>
        </div>

        {/* Grade Widget */}
        <div className="flex items-center justify-between p-3 bg-[#0b0b0f] border border-[#1f1f29] rounded">
          <div className="space-y-0.5">
            <span className="text-slate-500 uppercase text-[8px] font-bold block tracking-wider">
              Performance Rating
            </span>
            <span className="text-[11px] text-slate-300">Scale performance score</span>
          </div>
          <div className="size-12 rounded bg-[#f43f5e]/10 border border-[#f43f5e]/30 flex items-center justify-center text-xl font-bold text-[#f43f5e]">
            {finalGrade}
          </div>
        </div>

        {/* Run Details Grid */}
        <div className="bg-[#0b0b0f] border border-[#1f1f29] p-3 rounded space-y-2 text-[10px]">
          <span className="text-slate-500 uppercase text-[8px] font-bold block border-b border-[#1f1f29]/50 pb-1">
            Core Diagnostics Summary
          </span>
          <div className="grid grid-cols-2 gap-2.5 text-slate-300">
            <div className="flex justify-between">
              <span>Survived:</span>
              <span className="text-white font-bold">{stats.day} / 30 days</span>
            </div>
            <div className="flex justify-between">
              <span>Main Cause:</span>
              <span className="text-[#f43f5e] font-bold truncate max-w-[110px]">{cause.title}</span>
            </div>
            <div className="flex justify-between">
              <span>Peak Users:</span>
              <span className="text-white font-bold">{formatCompactNumber(stats.users)}</span>
            </div>
            <div className="flex justify-between">
              <span>Final MRR:</span>
              <span className="text-white font-bold">{formatCurrency(stats.mrr)}</span>
            </div>
            <div className="flex justify-between">
              <span>Final Cash:</span>
              <span className="text-white font-bold">{formatCurrency(stats.money)}</span>
            </div>
            <div className="flex justify-between">
              <span>Stability:</span>
              <span className="text-white font-bold">{stats.performance}%</span>
            </div>
          </div>
        </div>

        {/* Strategy Evaluation */}
        <div className="p-2.5 border border-[#f43f5e]/25 bg-[#f43f5e]/5 text-[9px] text-[#f43f5e] rounded leading-normal">
          <strong>Post-Mortem:</strong> {cause.main} Accumulate tech debt cautiously and scale platform capacity headroom early during traffic spikes.
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1.5">
          <button
            onClick={() => {
              playClick();
              restart();
            }}
            className="flex-1 py-2 bg-[#f43f5e] hover:bg-[#f43f5e]/90 text-white font-bold uppercase rounded cursor-pointer text-[10px] text-center"
          >
            Try Again
          </button>
          
          <button
            onClick={handleShare}
            className="px-4 py-2 border border-[#1f1f29] hover:bg-[#1a1a24] text-slate-300 hover:text-white font-bold uppercase rounded cursor-pointer text-[10px] flex items-center justify-center gap-1.5"
          >
            <Share2 className="size-3.5" />
            {copied ? "Copied!" : "Share Summary"}
          </button>
        </div>

      </div>
    </div>
  );
}
