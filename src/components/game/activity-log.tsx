"use client";

import { useGameStore } from "@/game/store/game-store";
import { useEffect, useRef } from "react";

interface LogEntry {
  day: number;
  type: "event" | "decision" | "economy" | "warning" | "critical";
  message: string;
}

const TYPE_COLORS: Record<string, string> = {
  event: "#3b82f6",
  decision: "#8b5cf6",
  economy: "#22c55e",
  warning: "#f59e0b",
  critical: "#ef4444",
};

const TYPE_LABELS: Record<string, string> = {
  event: "EVENT",
  decision: "DECISION",
  economy: "FINANCE",
  warning: "WARNING",
  critical: "CRITICAL",
};

export function ActivityLog() {
  const logs = useGameStore((s) => s.activityLogs);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-lg">
      <div className="px-3 py-2 border-b border-[#27272a]">
        <span className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">
          Activity Log
        </span>
      </div>
      <div className="max-h-40 overflow-y-auto p-3 space-y-1.5 text-[11px] font-mono">
        {logs.length === 0 && (
          <span className="text-[#52525b]">No activity yet...</span>
        )}
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-[#52525b] shrink-0">D{log.day}</span>
            <span
              className="font-bold shrink-0"
              style={{ color: TYPE_COLORS[log.type] }}
            >
              [{TYPE_LABELS[log.type]}]
            </span>
            <span className="text-[#a1a1aa]">{log.message}</span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
