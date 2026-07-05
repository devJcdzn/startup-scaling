"use client";

import { useGameStore, useGameStats } from "@/game/store/game-store";
import { useSound } from "@/hooks/use-sound";
import { useEffect, useState } from "react";
import { formatCurrency, formatCompactNumber } from "@/lib/formatters";
import { Trophy, Share2 } from "lucide-react";

export function VictoryScreen() {
  const restart = useGameStore((s) => s.restart);
  const stats = useGameStats();
  const { playClick } = useSound();
  const [copied, setCopied] = useState(false);

  // Grade calculation
  const getGrade = () => {
    if (stats.users >= 1_500_000 && stats.money >= 300_000) return "S";
    if (stats.users >= 1_300_000) return "A";
    if (stats.users >= 1_100_000) return "B";
    return "C";
  };

  const finalGrade = getGrade();

  useEffect(() => {
    // Save last run telemetry
    const lastRunSummary = {
      day: stats.day,
      result: "won",
      users: stats.users,
      mrr: stats.mrr,
    };
    localStorage.setItem("bos-last-run", JSON.stringify(lastRunSummary));

    // Save best run if superior
    const savedBest = localStorage.getItem("bos-best-run");
    const currentBest = savedBest ? JSON.parse(savedBest) : null;
    if (!currentBest || stats.users > currentBest.users) {
      localStorage.setItem("bos-best-run", JSON.stringify({
        users: stats.users,
        mrr: stats.mrr,
      }));
    }
  }, [stats.day, stats.users, stats.mrr]);

  const handleShare = () => {
    playClick();
    const text = `Battle of Scaling — Run Summary\n\nResult: Victory 🏆\nDays: 30/30\nPeak Users: ${formatCompactNumber(stats.users)}\nFinal MRR: ${formatCurrency(stats.mrr)}\nFinal Cash: ${formatCurrency(stats.money)}\nBiggest Strength: Revenue Growth\nGrade: ${finalGrade}\n\nScale your SaaS at Battle of Scaling!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-6 bg-[#0b0b0f] font-mono text-[#f3f4f6] select-none overflow-hidden">
      <div className="w-full max-w-md bg-[#121217] border border-[#1f1f29] rounded p-5 space-y-4 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="text-[9px] text-[#10b981] font-bold uppercase tracking-widest">
            Run Success
          </div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">
            Good Game: Scaled Successfully
          </h1>
          <p className="text-[10px] text-slate-400">
            Your SaaS survived 30 days and reached escape velocity.
          </p>
        </div>

        {/* Grade Widget */}
        <div className="flex items-center justify-between p-3 bg-[#0b0b0f] border border-[#1f1f29] rounded">
          <div className="space-y-0.5">
            <span className="text-slate-500 uppercase text-[8px] font-bold block tracking-wider">
              Final Rating
            </span>
            <span className="text-[11px] text-slate-300">Scale performance score</span>
          </div>
          <div className="size-12 rounded bg-emerald-500/10 border border-[#10b981]/30 flex items-center justify-center text-xl font-bold text-[#10b981]">
            {finalGrade}
          </div>
        </div>

        {/* Run Details Grid */}
        <div className="bg-[#0b0b0f] border border-[#1f1f29] p-3 rounded space-y-2 text-[10px]">
          <span className="text-slate-500 uppercase text-[8px] font-bold block border-b border-[#1f1f29]/50 pb-1">
            Diagnostics Report
          </span>
          <div className="grid grid-cols-2 gap-2.5 text-slate-300">
            <div className="flex justify-between">
              <span>Survived:</span>
              <span className="text-white font-bold">30 / 30 days</span>
            </div>
            <div className="flex justify-between">
              <span>Final Users:</span>
              <span className="text-[#10b981] font-bold">{formatCompactNumber(stats.users)}</span>
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
            <div className="flex justify-between">
              <span>Reputation:</span>
              <span className="text-white font-bold">{stats.reputation}%</span>
            </div>
          </div>
        </div>

        {/* Strategy Evaluation */}
        <div className="p-2.5 border border-[#10b981]/25 bg-emerald-500/5 text-[9px] text-[#10b981] rounded leading-normal">
          <strong>Winning Strategy:</strong> Strong user acquisition offset the compounding maintenance costs of scaling strain. Good uptime retention.
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1.5">
          <button
            onClick={() => {
              playClick();
              restart();
            }}
            className="flex-1 py-2 bg-[#10b981] hover:bg-[#10b981]/90 text-[#0b0b0f] font-bold uppercase rounded cursor-pointer text-[10px] text-center"
          >
            Play Again
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
