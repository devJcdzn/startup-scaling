"use client";

import { useGameStore, useGameStats } from "@/game/store/game-store";
import { useSound } from "@/hooks/use-sound";
import { TerminalPanel } from "@/components/ui/terminal-panel";
import { useEffect } from "react";
import { clearTerminalLogs } from "@/hooks/use-terminal-logs";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function getDefeatReason(
  money: number,
  performance: number,
  reputation: number,
  day: number,
  users: number
): string {
  if (money <= 0) return "CASH_RUNOUT: Account balance hit $0. Insolvency error.";
  if (performance <= 0) return "PERFORMANCE_COLLAPSE: Latency exceeded critical threshold. Users churned.";
  if (reputation <= 0) return "REPUTATION_SHUTDOWN: Public trust rating hit 0%. Board closed operations.";
  if (day >= 30 && users < 1_000_000)
    return `DEADLINE_EXCEEDED: Target milestone not reached. Required: 1.0M, Actual: ${formatNumber(users)}`;
  return "FATAL_CORE_DUMP: Process killed.";
}

export function DefeatScreen() {
  const restart = useGameStore((s) => s.restart);
  const stats = useGameStats();
  const { playClick } = useSound();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        playClick();
        clearTerminalLogs();
        restart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [restart, playClick]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-6 bg-[#121214] font-mono text-[#f43f5e] selection:bg-[#f43f5e] selection:text-[#121214]">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Terminal Header */}
        <div className="flex justify-between items-center text-[10px] text-[#f43f5e]/50 border-b border-[#f43f5e]/20 pb-2">
          <div>SESSION: LOCALHOST://COREDUMP-SHELL</div>
          <div>STATUS: PROCESS_PANIC_EXIT_1</div>
        </div>

        {/* Defeat JSON Report Panel */}
        <div className="relative border border-[#f43f5e]/40 bg-[#1a1a1e] font-mono text-[#f43f5e] rounded flex flex-col min-h-0 shadow-lg">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#f43f5e]/25 px-3 py-1.5 bg-[#141417] text-[10px] select-none text-[#f43f5e]/70 font-semibold shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[#f43f5e] font-bold font-mono">&gt;</span>
              <span className="tracking-wider uppercase font-mono">kernel_panic_dump</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-rose-500/80"></span>
              <span className="size-2 rounded-full bg-rose-500/30"></span>
              <span className="size-2 rounded-full bg-rose-500/30"></span>
            </div>
          </div>

          <div className="p-4 space-y-4 text-left py-2 text-xs">
            
            {/* Command Trigger */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#f43f5e] font-bold">$</span>
                <span className="text-white font-bold">cat /var/log/system-coredump.json</span>
              </div>
            </div>

            {/* JSON Code block */}
            <pre className="text-xs p-4 bg-[#141417] border border-[#f43f5e]/25 leading-relaxed overflow-x-auto whitespace-pre font-mono text-[#f43f5e]/90">
              <div>{`{`}</div>
              <div className="pl-4">
                <span className="text-[#e2e8f0]/80">&quot;status&quot;</span>: <span className="text-[#f43f5e] font-bold">&quot;FATAL_CRITICAL_CORE_DUMP&quot;</span>,
              </div>
              <div className="pl-4">
                <span className="text-[#e2e8f0]/80">&quot;exit_code&quot;</span>: <span className="text-white">1</span>,
              </div>
              <div className="pl-4">
                <span className="text-[#e2e8f0]/80">&quot;error_log&quot;</span>: <span className="text-white">&quot;{getDefeatReason(stats.money, stats.performance, stats.reputation, stats.day, stats.users)}&quot;</span>,
              </div>
              <div className="pl-4">
                <span className="text-[#e2e8f0]/80">&quot;telemetry&quot;</span>: {`{`}
              </div>
              <div className="pl-8">
                <span className="text-[#e2e8f0]/80">&quot;days_survived&quot;</span>: <span className="text-white">{stats.day}</span>,
              </div>
              <div className="pl-8">
                <span className="text-[#e2e8f0]/80">&quot;active_users&quot;</span>: <span className="text-white">{stats.users.toLocaleString()}</span>,
              </div>
              <div className="pl-8">
                <span className="text-[#e2e8f0]/80">&quot;liquid_cash&quot;</span>: <span className="text-white">${stats.money.toLocaleString()}</span>,
              </div>
              <div className="pl-8">
                <span className="text-[#e2e8f0]/80">&quot;system_health&quot;</span>: <span className="text-white">{stats.performance}%</span>,
              </div>
              <div className="pl-8">
                <span className="text-[#e2e8f0]/80">&quot;reputation&quot;</span>: <span className="text-white">{stats.reputation}/100</span>,
              </div>
              <div className="pl-8">
                <span className="text-[#e2e8f0]/80">&quot;technical_debt&quot;</span>: <span className="text-white">{stats.techDebt}%</span>
              </div>
              <div className="pl-4">{`}`}</div>
              <div>{`}`}</div>
            </pre>

            {/* Restart Prompts */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#f43f5e] font-bold">$</span>
                <span className="text-slate-300">npm run reboot</span>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  className="px-5 py-2 bg-[#f43f5e] text-[#121214] font-bold text-xs hover:bg-[#f43f5e]/90 active:translate-y-px transition-all cursor-pointer border border-[#f43f5e] font-mono rounded"
                  onClick={() => {
                    playClick();
                    clearTerminalLogs();
                    restart();
                  }}
                >
                  [ HOT_REBOOT_PROCESS ]
                </button>
                
                <span className="text-[10px] text-[#f43f5e]/60 cursor-default animate-pulse">
                  (Or press Enter to execute)
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-[#f43f5e]/40">
          CORE STACK REPORT // CLOSED SUITE REPORT
        </div>

      </div>
    </div>
  );
}
