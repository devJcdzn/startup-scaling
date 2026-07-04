"use client";

import { useGameStore } from "@/game/store/game-store";
import { useSound } from "@/hooks/use-sound";
import { TerminalPanel } from "@/components/ui/terminal-panel";
import { useEffect, useState } from "react";
import { clearTerminalLogs } from "@/hooks/use-terminal-logs";

export function StartScreen() {
  const startGame = useGameStore((s) => s.startGame);
  const { playClick } = useSound();
  const [theme, setTheme] = useState<"emerald" | "amber" | "cyan">("emerald");

  useEffect(() => {
    const savedTheme = localStorage.getItem("terminal-theme") as "emerald" | "amber" | "cyan" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
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
    applyTheme(t === "emerald" ? "emerald" : t);
    localStorage.setItem("terminal-theme", t);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        clearTerminalLogs();
        startGame();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startGame]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-6 bg-[#121214] font-mono text-[#e2e8f0] selection:bg-primary selection:text-[#121214]">
      <div className="w-full max-w-xl space-y-6">
        
        {/* Terminal Header */}
        <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-[#2e2e38] pb-2">
          <div>SESSION: LOCALHOST://BOS-CLIENT-SHELL</div>
          <div>ESTABLISHED: {new Date().toLocaleTimeString()}</div>
        </div>

        {/* Welcome Terminal Panel */}
        <TerminalPanel title="init_handshake" className="w-full shadow-lg">
          <div className="space-y-5 text-left py-2">
            
            {/* Terminal Command Output */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-primary font-bold">$</span>
                <span className="text-white font-bold">init --game &quot;battle-of-scaling&quot;</span>
              </div>
              <div className="text-[10px] text-slate-500">
                [OK] Shell initialization complete. Accessing simulator library...
              </div>
            </div>

            {/* Help Block / Description */}
            <div className="space-y-3 text-[11px] bg-[#141417] p-3 border border-[#2e2e38]">
              <div>
                <span className="text-primary font-bold uppercase">Description:</span>
                <p className="text-slate-300 mt-1 pl-4 leading-relaxed">
                  Grow a SaaS startup from 100 users to 1,000,000 in 30 days. Maintain operational cash, manage technical debt, resolve infrastructure incidents, and prevent system loads from bottlenecking growth.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-[#2e2e38] pt-2 mt-2">
                <div>
                  <span className="text-slate-500 block uppercase text-[9px] font-bold">--duration</span>
                  <span className="text-white">30 Days</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[9px] font-bold">--diagnostics</span>
                  <span className="text-white">7 Stats</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[9px] font-bold">--events</span>
                  <span className="text-white">17 Incidents</span>
                </div>
              </div>
            </div>

            {/* Start Prompt Actions */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-primary font-bold">$</span>
                <span className="text-slate-300">npm run dev <span className="text-primary">--theme={theme}</span></span>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  className="px-5 py-2 bg-primary text-[#121214] font-bold text-xs hover:bg-primary/90 active:translate-y-px transition-all cursor-pointer border border-primary font-mono rounded"
                  onClick={() => {
                    playClick();
                    clearTerminalLogs();
                    startGame();
                  }}
                >
                  [ EXECUTE_DEPLOYMENT ]
                </button>
                
                <span className="text-[10px] text-slate-500 cursor-default animate-pulse">
                  (Or press Enter to execute)
                </span>
              </div>
            </div>

          </div>
        </TerminalPanel>

        {/* Theme Settings Selector CLI-Style */}
        <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-[#2e2e38] pt-4">
          <div className="flex items-center gap-1.5">
            <span>SET COLOR PROFILE:</span>
            <div className="flex gap-1.5 font-bold">
              <button
                onClick={() => handleThemeChange("emerald")}
                className={`px-1.5 py-0.5 border cursor-pointer rounded-sm ${
                  theme === "emerald"
                    ? "bg-primary text-[#121214] border-primary"
                    : "border-neutral-800 hover:border-neutral-700 text-slate-400"
                }`}
              >
                emerald
              </button>
              <button
                onClick={() => handleThemeChange("amber")}
                className={`px-1.5 py-0.5 border cursor-pointer rounded-sm ${
                  theme === "amber"
                    ? "bg-primary text-[#121214] border-primary"
                    : "border-neutral-800 hover:border-neutral-700 text-slate-400"
                }`}
              >
                amber
              </button>
              <button
                onClick={() => handleThemeChange("cyan")}
                className={`px-1.5 py-0.5 border cursor-pointer rounded-sm ${
                  theme === "cyan"
                    ? "bg-primary text-[#121214] border-primary"
                    : "border-neutral-800 hover:border-neutral-700 text-slate-400"
                }`}
              >
                cyan
              </button>
            </div>
          </div>
          <div>BOS-AGENT SHELL v1.0.4</div>
        </div>

      </div>
    </div>
  );
}
