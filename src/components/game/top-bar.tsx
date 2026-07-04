"use client";

import { Rocket, CalendarDays, Timer, AlertTriangle } from "lucide-react";
import { TerminalProgress } from "@/components/ui/terminal-progress";

interface TopBarProps {
  day: number;
  timeScale: number;
  dayProgress: number;
  hasEvent: boolean;
}

export function TopBar({ day, timeScale, dayProgress, hasEvent }: TopBarProps) {
  return (
    <header className="h-[56px] border-b border-[#1f1f29] bg-[#121217] px-4 flex justify-between items-center text-xs shrink-0 select-none">
      <div className="flex items-center gap-3">
        <span className="font-bold text-white tracking-wider flex items-center gap-2">
          <Rocket className="size-4 text-[#10b981]" />
          <span>BATTLE OF SCALING</span>
        </span>
        <span className="text-[#1f1f29]">|</span>
        <div className="flex items-center gap-1.5 text-slate-400">
          <CalendarDays className="size-3.5 text-slate-500" />
          <span>Day {day} / 30</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {hasEvent && (
          <span className="flex items-center gap-1 text-[#f43f5e] font-bold animate-pulse text-[10px] uppercase">
            <AlertTriangle className="size-3.5" />
            Strategic Crisis Active
          </span>
        )}

        <div className="flex items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1">
            <Timer className="size-3.5" />
            Next day:
          </span>
          <TerminalProgress value={dayProgress} length={8} showPercent={false} className="scale-90" />
          <span className="text-[10px] text-slate-500">({timeScale.toFixed(1)}x)</span>
        </div>
      </div>
    </header>
  );
}
