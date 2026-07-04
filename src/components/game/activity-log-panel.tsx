"use client";

import React, { useRef, useEffect } from "react";
import { ScrollText, CalendarDays, TrendingUp, TrendingDown, Scale, Hourglass, Users, UserCheck, Repeat, Percent, Gauge, ShieldCheck, Flame, GitBranch, Bug, AlertTriangle, Siren, CircleCheck, Info, CircleAlert } from "lucide-react";

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

  // Translate low-level logs to business style and select appropriate icon
  const getBusinessLogDetail = (log: LogEntry) => {
    const message = log.message;

    if (message.includes("OS Boot sequence complete")) {
      return { tag: "SYSTEM", text: "Executive dashboard initialized.", color: "text-[#10b981]", icon: CircleCheck };
    }
    if (message.includes("Connected to SaaS DB")) {
      return { tag: "SYSTEM", text: "Database connection established securely.", color: "text-[#10b981]", icon: CircleCheck };
    }
    if (message.includes("Starting server daemon")) {
      return { tag: "SYSTEM", text: "Production API services listening.", color: "text-slate-400", icon: Info };
    }
    if (message.includes("SaaS Online. Day 1 begun.")) {
      return { tag: "SYSTEM", text: "Core SaaS Platform Online.", color: "text-[#10b981] font-bold", icon: CircleCheck };
    }
    if (message.includes("SaaS Simulator Resetting...")) {
      return { tag: "SYSTEM", text: "SaaS Simulator Resetting...", color: "text-slate-400", icon: Info };
    }
    
    if (message.includes("DAY") && message.includes("Operational cost")) {
      const dayMatch = message.match(/DAY (\d+)/);
      const costMatch = message.match(/cost: -\$(\d+)/);
      const day = dayMatch ? dayMatch[1] : "";
      const cost = costMatch ? costMatch[1] : "";
      return { tag: "FINANCE", text: `Day ${day} started. Running operations cost -$${cost}.`, color: "text-[#f43f5e]", icon: TrendingDown };
    }
    if (message.includes("ALERT:")) {
      const cleanMsg = message.replace("ALERT: ", "").replace(/\(Severity: .*\)/g, "");
      return { tag: "RISK", text: `Strategic Alert: ${cleanMsg}`, color: "text-[#f59e0b] font-bold", icon: AlertTriangle };
    }
    if (message.includes("DETAILS:")) {
      return { tag: "ANALYSIS", text: message.replace("DETAILS: ", ""), color: "text-slate-300", icon: Info };
    }
    if (message.includes("Choice executed successfully. System stabilized.")) {
      return { tag: "RESOLUTION", text: "Incident resolved. Product architecture updated.", color: "text-[#10b981]", icon: CircleCheck };
    }
    if (message.includes("Cashflow update")) {
      const isPositive = message.includes("+");
      const valMatch = message.match(/[+-]\$(\d+)/);
      const val = valMatch ? valMatch[0] : "";
      return { tag: "FINANCE", text: `Cashflow update: ${val} adjusted reserves.`, color: isPositive ? "text-[#10b981]" : "text-[#f43f5e]", icon: isPositive ? TrendingUp : TrendingDown };
    }
    if (message.includes("User signups")) {
      const diffMatch = message.match(/\+(\d+)/);
      const diff = diffMatch ? diffMatch[0] : "";
      return { tag: "GROWTH", text: `Conversion boost: ${diff} new customer accounts activated.`, color: "text-[#10b981]", icon: Users };
    }
    if (message.includes("User churn")) {
      const diffMatch = message.match(/-\d+|\d+/);
      const diff = diffMatch ? diffMatch[0] : "";
      return { tag: "CHURN", text: `Churn Alert: ${diff} subscription accounts closed.`, color: "text-[#f43f5e]", icon: AlertTriangle };
    }
    return { tag: "FEED", text: message, color: "text-slate-400", icon: Info };
  };

  return (
    <div className="bg-[#121217] border border-[#1f1f29] rounded flex flex-col min-h-0 overflow-hidden select-none">
      <div className="px-3 py-2 border-b border-[#1f1f29] bg-[#0b0b0f] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <ScrollText className="size-3.5 text-[#10b981]" />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            The Startup Feed
          </span>
        </div>
        <span className="text-[8px] text-slate-500 font-semibold uppercase">Feed Stream</span>
      </div>

      <div className="flex-1 p-3 min-h-0 flex flex-col justify-between">
        {logs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 gap-1.5">
            <ScrollText className="size-8 text-slate-600 animate-pulse" />
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              No activity yet
            </h4>
            <p className="text-[9px]">Events and decisions will appear here.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto scroller min-h-0 pr-1 space-y-2">
            {logs.map((log, idx) => {
              const detail = getBusinessLogDetail(log);
              const LogIcon = detail.icon;
              return (
                <div key={idx} className="flex gap-2 items-start text-[10px] leading-relaxed select-text">
                  <div className="shrink-0 pt-0.5">
                    <LogIcon className="size-3 text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-slate-500 font-semibold mr-1">[{detail.tag}]</span>
                    <span className={`${detail.color}`}>{detail.text}</span>
                  </div>
                </div>
              );
            })}
            <div ref={logEndRef} />
          </div>
        )}

        <div className="border-t border-[#1f1f29]/50 pt-1.5 mt-2 flex items-center justify-between text-[9px] text-slate-500 shrink-0">
          <span>Active Operations Monitor</span>
          <span className="size-1 bg-[#10b981] rounded-full animate-ping"></span>
        </div>
      </div>
    </div>
  );
}
