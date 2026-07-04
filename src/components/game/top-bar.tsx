"use client";

import { Badge } from "@/components/ui/badge";
import { STRINGS } from "@/game/content/strings";

interface TopBarProps {
  day: number;
  timeScale: number;
  status: string;
  countdown?: number;
}

export function TopBar({ day, timeScale, status, countdown }: TopBarProps) {
  const statusColor =
    status === "decision"
      ? "text-[#f59e0b] border-[#f59e0b]/30"
      : "text-[#22c55e] border-[#22c55e]/30";

  return (
    <header className="border-b border-[#27272a] bg-[#18181b] px-4 py-2 flex items-center justify-between text-xs">
      <div className="flex items-center gap-3">
        <span className="font-bold text-[#fafafa] tracking-wide">
          {STRINGS.gameTitle}
        </span>
        <span className="text-[#52525b]">·</span>
        <span className="text-[#a1a1aa]">{STRINGS.dayLabel(day)}</span>
        {timeScale < 1 && (
          <>
            <span className="text-[#52525b]">·</span>
            <Badge variant="outline" className={`text-[10px] ${statusColor}`}>
              {status === "decision" ? "Decision Active" : "Time Slowed"}
            </Badge>
          </>
        )}
      </div>
      <div className="flex items-center gap-2 text-[#a1a1aa]">
        {countdown !== undefined && countdown > 0 && (
          <span className="text-[#ef4444] font-medium">
            Penalty in {countdown.toFixed(1)}s
          </span>
        )}
        <span className="text-[#52525b]">·</span>
        <span>{timeScale < 1 ? `${timeScale.toFixed(2)}x` : "1.00x"}</span>
      </div>
    </header>
  );
}
