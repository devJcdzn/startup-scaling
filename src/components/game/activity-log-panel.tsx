"use client";

import React, { useRef, useEffect } from "react";
import { ScrollText, Info } from "lucide-react";

interface LogEntry {
  timestamp: string;
  type: "system" | "user" | "cash" | "warn" | "critical" | "success";
  message: string;
}

interface ActivityLogPanelProps {
  logs: LogEntry[];
}

export function ActivityLogPanel({ logs }: ActivityLogPanelProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Clean log entry down to a plain natural business narrative phrase
  const getNarrativeMessage = (msg: string) => {
    if (msg.includes("OS Boot sequence complete") || msg.includes("Connected to SaaS DB") || msg.includes("Starting server daemon")) {
      return "SaaS telemetry initialized.";
    }
    if (msg.includes("SaaS Online. Day 1 begun.")) {
      return "SaaS launched online.";
    }
    if (msg.includes("SaaS Simulator Resetting...")) {
      return "SaaS Simulator Resetting...";
    }
    if (msg.includes("DAY") && msg.includes("Operational cost")) {
      const dayMatch = msg.match(/DAY (\d+)/);
      const costMatch = msg.match(/cost: -\$(\d+)/);
      const day = dayMatch ? dayMatch[1] : "";
      const cost = costMatch ? costMatch[1] : "";
      return `Day ${day} Started · Operations cost -$${cost}.`;
    }
    if (msg.includes("ALERT:")) {
      return msg.replace("ALERT: ", "").replace(/\(Severity: .*\)/g, "").trim();
    }
    if (msg.includes("DETAILS:")) {
      return msg.replace("DETAILS: ", "").trim();
    }
    if (msg.includes("Choice executed successfully. System stabilized.")) {
      return "Incident resolved. Main update applied.";
    }
    if (msg.includes("Cashflow update")) {
      const valMatch = msg.match(/[+-]\$(\d+)/);
      const val = valMatch ? valMatch[0] : "";
      return `Burn rate adjusted by ${val}.`;
    }
    if (msg.includes("User signups")) {
      const diffMatch = msg.match(/\+(\d+)/);
      const diff = diffMatch ? diffMatch[0] : "";
      return `${diff} new users converted.`;
    }
    if (msg.includes("User churn")) {
      const diffMatch = msg.match(/-\d+|\d+/);
      const diff = diffMatch ? diffMatch[0] : "";
      return `Churn: ${diff} sub-accounts closed.`;
    }
    return msg;
  };

  // Slice last 5 elements to avoid scrolls
  const visibleLogs = logs.slice(-5);

  return (
    <div className="bg-[#121217] border border-[#1f1f29] rounded flex flex-col min-h-0 flex-1 overflow-hidden select-none">
      <div className="px-3 py-2 border-b border-[#1f1f29] bg-[#0b0b0f] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <ScrollText className="size-3.5 text-[#10b981]" />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Timeline
          </span>
        </div>
        <span className="text-[8px] text-slate-500 font-semibold uppercase font-mono">History</span>
      </div>

      <div className="flex-1 p-3 min-h-0 flex flex-col justify-between overflow-hidden">
        {logs.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center text-slate-500 gap-1">
            <ScrollText className="size-5 text-slate-600" />
            <span className="text-[8px] font-bold uppercase">No records</span>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto scroller pr-1 space-y-1.5 min-h-0">
            {visibleLogs.map((log, idx) => {
              const cleaned = getNarrativeMessage(log.message);
              return (
                <div key={idx} className="flex gap-2 items-start text-[9px] font-mono leading-relaxed select-text text-slate-400">
                  <div className="shrink-0 pt-1">
                    <Info className="size-2.5 text-slate-600" />
                  </div>
                  <div>
                    <span className="text-white font-bold">{cleaned}</span>
                  </div>
                </div>
              );
            })}
            <div ref={logEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
