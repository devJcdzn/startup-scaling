"use client";

import { useGameStore, useGameStats } from "@/game/store/game-store";
import { useSound } from "@/hooks/use-sound";
import { TerminalPanel } from "@/components/ui/terminal-panel";
import { useEffect } from "react";
import { clearTerminalLogs } from "@/hooks/use-terminal-logs";

export function VictoryScreen() {
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
    <div className="h-screen w-screen flex flex-col items-center justify-center p-6 bg-[#121214] font-mono text-[#e2e8f0] selection:bg-primary selection:text-[#121214]">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Terminal Header */}
        <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-[#2e2e38] pb-2">
          <div>SESSION: LOCALHOST://AUDIT-REPORT-DAEMON</div>
          <div>STATUS: SUCCESSFUL_RUN</div>
        </div>

        {/* Victory JSON Report Panel */}
        <TerminalPanel title="audit_result" className="w-full shadow-lg">
          <div className="space-y-4 text-left py-2">
            
            {/* Command Trigger */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-primary font-bold">$</span>
                <span className="text-white font-bold">cat /var/log/startup-outcome.json</span>
              </div>
            </div>

            {/* JSON Code block */}
            <pre className="text-xs p-4 bg-[#141417] border border-[#2e2e38] leading-relaxed overflow-x-auto whitespace-pre font-mono">
              <div>{`{`}</div>
              <div className="pl-4">
                <span className="text-rose-400">&quot;status&quot;</span>: <span className="text-primary">&quot;SUCCESSFUL_EXIT_CODE_0&quot;</span>,
              </div>
              <div className="pl-4 text-slate-400">
                <span className="text-rose-400">&quot;summary&quot;</span>: <span className="text-amber-300">&quot;Startup successfully scaled past growth milestone.&quot;</span>,
              </div>
              <div className="pl-4">
                <span className="text-rose-400">&quot;telemetry&quot;</span>: {`{`}
              </div>
              <div className="pl-8">
                <span className="text-rose-400">&quot;active_users&quot;</span>: <span className="text-cyan-400">{stats.users.toLocaleString()}</span>,
              </div>
              <div className="pl-8">
                <span className="text-rose-400">&quot;liquid_cash&quot;</span>: <span className="text-cyan-400">${stats.money.toLocaleString()}</span>,
              </div>
              <div className="pl-8">
                <span className="text-rose-400">&quot;reputation_rating&quot;</span>: <span className="text-cyan-400">{stats.reputation}</span>,
              </div>
              <div className="pl-8">
                <span className="text-rose-400">&quot;duration_days&quot;</span>: <span className="text-cyan-400">30</span>,
              </div>
              <div className="pl-8">
                <span className="text-rose-400">&quot;technical_debt&quot;</span>: <span className="text-cyan-400">{stats.techDebt}%</span>,
              </div>
              <div className="pl-8">
                <span className="text-rose-400">&quot;pending_bug_count&quot;</span>: <span className="text-cyan-400">{stats.bugs}</span>
              </div>
              <div className="pl-4">{`}`}</div>
              <div>{`}`}</div>
            </pre>

            {/* Restart Prompts */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-primary font-bold">$</span>
                <span className="text-slate-300">npm run restart</span>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  className="px-5 py-2 bg-primary text-[#121214] font-bold text-xs hover:bg-primary/90 active:translate-y-px transition-all cursor-pointer border border-primary font-mono rounded"
                  onClick={() => {
                    playClick();
                    clearTerminalLogs();
                    restart();
                  }}
                >
                  [ REBOOT_SIMULATOR ]
                </button>
                
                <span className="text-[10px] text-slate-500 cursor-default animate-pulse">
                  (Or press Enter to execute)
                </span>
              </div>
            </div>

          </div>
        </TerminalPanel>

        {/* Footer info */}
        <div className="text-center text-[10px] text-slate-500">
          REPORT GENERATED // PROCESS EXITED SUCCESSFULLY
        </div>

      </div>
    </div>
  );
}
