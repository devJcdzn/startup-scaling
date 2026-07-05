"use client";

import { useGameStore } from "@/game/store/game-store";
import { useSound } from "@/hooks/use-sound";
import { TerminalPanel } from "@/components/ui/terminal-panel";
import { useEffect, useState } from "react";
import { clearTerminalLogs } from "@/hooks/use-terminal-logs";
import { HowToPlayDialog } from "@/components/game/dialogs/how-to-play-dialog";
import { Rocket, HelpCircle, Trophy, BookOpen } from "lucide-react";
import { formatCurrency, formatCompactNumber } from "@/lib/formatters";

export function StartScreen() {
  const startGame = useGameStore((s) => s.startGame);
  const { playClick } = useSound();
  const [theme, setTheme] = useState<"emerald" | "amber" | "cyan">("emerald");
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Local storage telemetry
  const [lastRun, setLastRun] = useState<{ day: number; result: string; cause?: string; users?: number } | null>(null);
  const [bestRun, setBestRun] = useState<{ users: number; mrr: number } | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("terminal-theme") as "emerald" | "amber" | "cyan" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
    const savedLast = localStorage.getItem("bos-last-run");
    if (savedLast) setLastRun(JSON.parse(savedLast));
    const savedBest = localStorage.getItem("bos-best-run");
    if (savedBest) setBestRun(JSON.parse(savedBest));
  }, []);

  const applyTheme = (t: "emerald" | "amber" | "cyan") => {
    const root = document.documentElement;
    root.classList.remove("theme-amber", "theme-cyan");
    if (t === "amber") root.classList.add("theme-amber");
    if (t === "cyan") root.classList.add("theme-cyan");
  };

  const handleThemeChange = (t: "emerald" | "amber" | "cyan") => {
    playClick();
    setTheme(t);
    applyTheme(t);
    localStorage.setItem("terminal-theme", t);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isHelpOpen) {
        clearTerminalLogs();
        startGame();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startGame, isHelpOpen]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-6 bg-[#0b0b0f] font-sans text-[#f3f4f6] selection:bg-primary selection:text-[#0b0b0f] overflow-hidden select-none">
      <div className="w-full max-w-3xl space-y-5">
        
        {/* Terminal Header */}
        <div className="flex justify-between items-center text-[9px] text-slate-500 border-b border-[#1f1f29] pb-2 font-mono">
          <div className="flex items-center gap-1.5 font-bold">
            <Rocket className="size-3.5 text-[#10b981]" />
            <span>LOCALHOST://BATTLE-OF-SCALING</span>
          </div>
          <div>BOS-CONSOLE v0.4.3</div>
        </div>

        {/* Welcome Dashboard Panel */}
        <TerminalPanel title="SaaS Strategy Command Console" className="w-full shadow-2xl">
          <div className="space-y-5 text-left py-1">
            
            {/* Title Block */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-extrabold text-white tracking-wider flex items-center justify-center sm:justify-start gap-2.5 font-mono">
                🚀 BATTLE OF SCALING
              </h1>
              <p className="text-xs text-slate-400 mt-1.5">
                Build a SaaS. Survive the traffic. Scale or collapse.
              </p>
            </div>

            {/* Split Grid Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left: Objective */}
              <div className="space-y-2.5 text-[11px] bg-[#0b0b0f] p-3.5 border border-[#1f1f29] rounded">
                <span className="text-[#10b981] font-bold uppercase tracking-wider text-[9px] font-mono block">
                  Objective Goal
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Reach <strong className="text-white">1,000,000 active users</strong> in 30 days. Don&apos;t let Cash, Stability or Reputation hit zero. Balance scaling speed with technical debt control loops.
                </p>
              </div>

              {/* Right: How the Run Works */}
              <div className="space-y-2.5 text-[11px] bg-[#0b0b0f] p-3.5 border border-[#1f1f29] rounded">
                <span className="text-purple-400 font-bold uppercase tracking-wider text-[9px] font-mono block">
                  How the Run Works
                </span>
                <ul className="text-slate-300 space-y-1 pl-1">
                  <li className="flex items-start gap-1">
                    <span className="text-[#10b981] font-bold mr-1">1.</span>
                    <span>Grow users and maximize MRR base.</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-[#10b981] font-bold mr-1">2.</span>
                    <span>Fix bugs and refactor code to maintain stability.</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-[#10b981] font-bold mr-1">3.</span>
                    <span>Keep runway extended against operational costs.</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-[#10b981] font-bold mr-1">4.</span>
                    <span>Resolve priority incidents and strategic events.</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Run Logs / Scoreboard Summary */}
            <div className="grid grid-cols-2 gap-3 text-[10px]">
              <div className="bg-[#0b0b0f] border border-[#1f1f29] p-3 rounded">
                <span className="text-slate-500 uppercase tracking-wider text-[8px] font-bold block mb-1 font-mono">
                  Last Run Diagnostics
                </span>
                {lastRun ? (
                  <div className="space-y-1 text-slate-300">
                    <div>Status: <span className={lastRun.result === "won" ? "text-emerald-400 font-bold" : "text-[#f43f5e] font-bold"}>
                      {lastRun.result === "won" ? "Victory" : "Failed"}
                    </span></div>
                    <div>Survived: {lastRun.day} / 30 days</div>
                    {lastRun.cause && <div className="truncate text-slate-500 text-[9px]">Cause: {lastRun.cause}</div>}
                  </div>
                ) : (
                  <span className="text-slate-500 block italic py-1">No past records.</span>
                )}
              </div>

              <div className="bg-[#0b0b0f] border border-[#1f1f29] p-3 rounded">
                <span className="text-slate-500 uppercase tracking-wider text-[8px] font-bold block mb-1 flex items-center gap-1 font-mono">
                  <Trophy className="size-3 text-[#f59e0b]" />
                  Best Run Highscore
                </span>
                {bestRun ? (
                  <div className="space-y-1 text-slate-300">
                    <div>Users: <span className="text-[#10b981] font-bold">{formatCompactNumber(bestRun.users)}</span></div>
                    <div>MRR: <span className="text-white font-bold">{formatCurrency(bestRun.mrr)}</span></div>
                    <div className="text-slate-500 text-[9px]">Escape velocity reached</div>
                  </div>
                ) : (
                  <span className="text-slate-500 block italic py-1">No records yet.</span>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center gap-3">
              <button
                className="px-6 py-2.5 bg-[#10b981] hover:bg-[#10b981]/90 text-[#0b0b0f] font-bold text-[10px] uppercase rounded cursor-pointer transition-all shadow-md"
                onClick={() => {
                  playClick();
                  clearTerminalLogs();
                  startGame();
                }}
              >
                Start New Run
              </button>

              <button
                className="px-4 py-2.5 border border-[#1f1f29] hover:bg-[#1a1a24] text-slate-300 hover:text-white font-bold text-[10px] uppercase rounded cursor-pointer flex items-center gap-1.5 transition-all"
                onClick={() => {
                  playClick();
                  setIsHelpOpen(true);
                }}
              >
                <HelpCircle className="size-3.5" />
                How to Play
              </button>

              <span className="text-[9px] text-slate-500 hidden sm:inline ml-1.5 animate-pulse font-mono">
                (Or press Enter to execute)
              </span>
            </div>

          </div>
        </TerminalPanel>

        {/* Theme Settings Selector */}
        <div className="flex justify-between items-center text-[9px] text-slate-500 border-t border-[#1f1f29] pt-4 font-mono">
          <div className="flex items-center gap-1.5">
            <span>BRAND COLORWAY:</span>
            <div className="flex gap-1.5 font-bold">
              {["emerald", "amber", "cyan"].map((t) => (
                <button
                  key={t}
                  onClick={() => handleThemeChange(t as any)}
                  className={`px-2 py-0.5 border cursor-pointer rounded-sm uppercase ${
                    theme === t
                      ? "bg-primary text-[#0b0b0f] border-primary"
                      : "border-neutral-800 hover:border-neutral-700 text-slate-400"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>BOS PORT ENGINE</div>
        </div>

      </div>

      <HowToPlayDialog isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
