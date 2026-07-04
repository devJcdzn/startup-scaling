"use client";

import { useGameStore, useGameStats, useGameEvent } from "@/game/store/game-store";
import { useGameLoop } from "@/hooks/use-game-loop";
import { TerminalPanel } from "@/components/ui/terminal-panel";
import { TerminalProgress } from "@/components/ui/terminal-progress";
import { FeedbackPopup } from "@/components/feedback/feedback-popup";
import { useSound } from "@/hooks/use-sound";
import { useTerminalLogs, LogEntry, addTerminalLog } from "@/hooks/use-terminal-logs";
import { useState, useEffect, useRef } from "react";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatEffects(effects: Record<string, number>): string {
  return Object.entries(effects)
    .map(([key, value]) => {
      const sign = value > 0 ? "+" : "";
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase());
      return `${sign}${value} ${label}`;
    })
    .join(", ");
}

export function GameScreen() {
  useGameLoop();
  
  const state = useGameStore();
  const stats = useGameStats();
  const { currentEvent, lastPenaltyTime } = useGameEvent();
  const choose = useGameStore((s) => s.choose);
  const { playClick } = useSound();
  const logs = useTerminalLogs();
  
  const logEndRef = useRef<HTMLDivElement>(null);
  
  // Tabs: "diagnostics" | "incidents" | "analytics" | "settings"
  const [activeTab, setActiveTab] = useState<"diagnostics" | "incidents" | "analytics" | "settings">("diagnostics");
  
  // Mobile Tab selector: "core" | "alerts" | "infra"
  const [mobileTab, setMobileTab] = useState<"core" | "alerts" | "infra">("core");
  
  // CPU/RAM System Widget state
  const [cpu, setCpu] = useState(22.1);
  const [ram, setRam] = useState(4.25);
  const [activeTheme, setActiveTheme] = useState<"emerald" | "amber" | "cyan">("emerald");

  // CLI Prompt state
  const [command, setCommand] = useState("");
  const promptInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("terminal-theme") as "emerald" | "amber" | "cyan" | null;
    if (savedTheme) {
      setActiveTheme(savedTheme);
    }
  }, []);

  const changeTheme = (t: "emerald" | "amber" | "cyan") => {
    playClick();
    setActiveTheme(t);
    const root = document.documentElement;
    root.classList.remove("theme-amber", "theme-cyan");
    if (t === "amber") root.classList.add("theme-amber");
    if (t === "cyan") root.classList.add("theme-cyan");
    localStorage.setItem("terminal-theme", t);
  };

  // Auto-focus incidents tab when a new event triggers
  useEffect(() => {
    if (currentEvent) {
      setActiveTab("incidents");
      setMobileTab("alerts");
      // Append warning log for CLI focus
      addTerminalLog("critical", `PROMPT FOCUS: Resolution required. Type 1, 2, or 3 in the prompt.`);
    }
  }, [currentEvent]);

  // Fluctuating system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.max(8, Math.min(99, 15 + Math.random() * 12 + (currentEvent ? 30 : 0))));
      setRam(Math.max(4.0, Math.min(12.0, 4.2 + Math.random() * 0.15 + (stats.users / 200000))));
    }, 1500);
    return () => clearInterval(interval);
  }, [currentEvent, stats.users]);

  // Scroll terminal logs to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Keyboard controls for event choices
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.status === "decision" && currentEvent) {
        // If they aren't focusing the input prompt, let them select directly
        if (document.activeElement?.tagName !== "INPUT") {
          const choiceIndex = parseInt(e.key, 10) - 1;
          if (choiceIndex >= 0 && choiceIndex < currentEvent.choices.length) {
            playClick();
            choose(choiceIndex);
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.status, currentEvent, choose, playClick]);

  // Command prompt input handler (Warp/Ghostty style)
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = command.trim().toLowerCase();
    setCommand("");

    if (!currentEvent) {
      addTerminalLog("system", `System is idling. No incidents require manual input.`);
      return;
    }

    if (cleanCmd === "1" || cleanCmd === "scale" || cleanCmd.includes("option 1") || cleanCmd === "exec --opt-1") {
      playClick();
      choose(0);
    } else if (cleanCmd === "2" || cleanCmd === "cache" || cleanCmd.includes("option 2") || cleanCmd === "exec --opt-2") {
      if (currentEvent.choices.length > 1) {
        playClick();
        choose(1);
      }
    } else if (cleanCmd === "3" || cleanCmd === "ignore" || cleanCmd.includes("option 3") || cleanCmd === "exec --opt-3") {
      if (currentEvent.choices.length > 2) {
        playClick();
        choose(2);
      }
    } else {
      addTerminalLog("warn", `Command rejected: "${cleanCmd}". Executable actions: [1], [2], [3].`);
    }
  };

  // Delay penalty countdown
  const [countdown, setCountdown] = useState<number>(0);
  useEffect(() => {
    if (!currentEvent || !currentEvent.delayPenalty) return;

    const interval = setInterval(() => {
      const now = performance.now();
      const elapsed = now - lastPenaltyTime;
      const remaining = Math.max(
        0,
        (currentEvent.delayPenalty!.intervalMs - elapsed) / 1000
      );
      setCountdown(remaining);
    }, 100);

    return () => clearInterval(interval);
  }, [currentEvent, lastPenaltyTime]);

  const dayProgress = (stats.day / 30) * 100;
  
  const getLogColorClass = (type: LogEntry["type"]) => {
    switch (type) {
      case "critical": return "text-[#f43f5e] font-bold";
      case "warn": return "text-amber-500";
      case "cash": return "text-primary/90";
      case "success": return "text-primary font-bold";
      case "user": return "text-slate-300";
      default: return "text-slate-500";
    }
  };

  // Generate CPU & RAM visual bar logs
  const getSysBar = (val: number) => {
    const len = 10;
    const filled = Math.round((val / 100) * len);
    const empty = len - filled;
    return `[${"|".repeat(filled)}${".".repeat(empty)}]`;
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#121214] font-mono text-[#e2e8f0] selection:bg-primary selection:text-[#121214] overflow-hidden">
      
      {/* HEADER COMPACT */}
      <header className="border-b border-[#2e2e38] bg-[#16161a] px-4 py-2 flex justify-between items-center text-[10px] shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-bold text-white tracking-wider flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
            WARP-CLIENT://SAAS-SIM-SHELL
          </span>
          <span className="text-slate-600">|</span>
          <span>SPEED: {stats.timeScale.toFixed(2)}x</span>
        </div>
        <div className="flex items-center gap-2">
          <span>DAY {stats.day}/30</span>
          <TerminalProgress value={dayProgress} length={10} showPercent={false} className="scale-90" />
        </div>
      </header>

      {/* MOBILE INTERFACE (< 768px) locked viewport */}
      <div className="flex-grow flex flex-col md:hidden overflow-hidden min-h-0 bg-[#121214]">
        
        {/* MOBILE HEADER (Fixed stats) */}
        <div className="p-3 border-b border-[#2e2e38] bg-[#16161a] grid grid-cols-4 gap-1 text-center shrink-0">
          <div>
            <span className="block text-[8px] text-slate-500 font-bold uppercase">Cash</span>
            <span className="text-xs font-bold text-white">${stats.money.toLocaleString()}</span>
          </div>
          <div>
            <span className="block text-[8px] text-slate-500 font-bold uppercase">Users</span>
            <span className="text-xs font-bold text-white">{formatNumber(stats.users)}</span>
          </div>
          <div>
            <span className="block text-[8px] text-slate-500 font-bold uppercase">Load</span>
            <span className="text-xs font-bold text-white">{(100 - stats.performance)}%</span>
          </div>
          <div>
            <span className="block text-[8px] text-slate-500 font-bold uppercase">Reputation</span>
            <span className="text-xs font-bold text-white">{stats.reputation}%</span>
          </div>
        </div>

        {/* MOBILE BODY (Flexible Tabbed Views) */}
        <div className="flex-1 overflow-y-auto p-4 scroller min-h-0">
          {mobileTab === "core" && (
            <div className="space-y-4">
              <TerminalPanel title="diagnostics_telemetry" showControls={false}>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                      <span>MARKETING HYPE:</span>
                      <span className="font-bold text-white">{stats.hype}%</span>
                    </div>
                    <TerminalProgress value={stats.hype} length={18} showPercent={false} />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                      <span>TECHNICAL DEBT:</span>
                      <span className="font-bold text-white">{stats.techDebt}%</span>
                    </div>
                    <TerminalProgress value={stats.techDebt} length={18} showPercent={false} />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                      <span>ACTIVE BUG QUEUE:</span>
                      <span className="font-bold text-white">{stats.bugs} bugs</span>
                    </div>
                    <TerminalProgress value={stats.bugs} length={18} showPercent={false} />
                  </div>
                </div>
              </TerminalPanel>
            </div>
          )}

          {mobileTab === "alerts" && (
            <div className="h-full flex flex-col justify-center">
              {currentEvent ? (
                <TerminalPanel title="active_incident" className="border-[#f43f5e]/50" showControls={false}>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold px-1.5 py-0.5 bg-[#f43f5e]/15 border border-[#f43f5e]/30 text-[#f43f5e] rounded-sm uppercase">
                        {currentEvent.severity}
                      </span>
                      {currentEvent.delayPenalty && (
                        <span className="text-[#f43f5e] font-bold animate-pulse">
                          ESCALATE: {countdown.toFixed(1)}s
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-bold text-white uppercase">{currentEvent.title}</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{currentEvent.description}</p>
                    {currentEvent.delayPenalty && (
                      <div className="text-[9px] text-[#f43f5e]/80 bg-[#f43f5e]/5 p-2 rounded-sm mt-1 border border-[#f43f5e]/15">
                        Penalty: {formatEffects(currentEvent.delayPenalty.effects)} / {(currentEvent.delayPenalty.intervalMs / 1000)}s
                      </div>
                    )}
                  </div>
                </TerminalPanel>
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs">
                  NO CRITICAL ALERTS ACTIVE. SYSTEM STABLE.
                </div>
              )}
            </div>
          )}

          {mobileTab === "infra" && (
            <div className="space-y-3">
              <TerminalPanel title="system_workstation" showControls={false}>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 mb-2">
                  <div>CPU: <span className="font-bold text-white">{cpu.toFixed(1)}%</span></div>
                  <div>RAM: <span className="font-bold text-white">{ram.toFixed(2)}GB</span></div>
                </div>
                <div className="border-t border-[#2e2e38] pt-2 max-h-[120px] overflow-y-auto scroller text-[9px] space-y-1">
                  {logs.slice(-10).map((log, idx) => (
                    <div key={idx} className="truncate">
                      <span className="text-slate-600 mr-1">[{log.timestamp}]</span>
                      <span className={getLogColorClass(log.type)}>{log.message}</span>
                    </div>
                  ))}
                </div>
              </TerminalPanel>
            </div>
          )}
        </div>

        {/* MOBILE FOOTER & TABS (Fixed Command palette and Tab select) */}
        <div className="border-t border-[#2e2e38] bg-[#16161a] p-2 shrink-0 z-40">
          
          {/* Active input actions if event */}
          {currentEvent && mobileTab === "alerts" && (
            <div className="grid grid-cols-3 gap-1.5 mb-2.5">
              {currentEvent.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => {
                    playClick();
                    choose(i);
                  }}
                  className="bg-[#232329] border border-primary/40 hover:border-primary px-1.5 py-2 text-[10px] text-white font-bold text-center rounded truncate cursor-pointer"
                >
                  [{i + 1}] {choice.text}
                </button>
              ))}
            </div>
          )}

          {/* Navigation tabs */}
          <div className="grid grid-cols-3 gap-1 text-center font-bold text-[10px]">
            <button
              onClick={() => { playClick(); setMobileTab("core"); }}
              className={`py-2 rounded cursor-pointer ${
                mobileTab === "core" ? "bg-primary text-[#121214]" : "text-slate-400 bg-[#232329]/40 hover:bg-[#232329]/60"
              }`}
            >
              CORE_METRICS
            </button>
            <button
              onClick={() => { playClick(); setMobileTab("alerts"); }}
              className={`py-2 rounded relative cursor-pointer ${
                mobileTab === "alerts" ? "bg-primary text-[#121214]" : "text-slate-400 bg-[#232329]/40 hover:bg-[#232329]/60"
              }`}
            >
              ALERTS {currentEvent && <span className="absolute top-1 right-2 size-2 bg-[#f43f5e] rounded-full animate-ping"></span>}
            </button>
            <button
              onClick={() => { playClick(); setMobileTab("infra"); }}
              className={`py-2 rounded cursor-pointer ${
                mobileTab === "infra" ? "bg-primary text-[#121214]" : "text-slate-400 bg-[#232329]/40 hover:bg-[#232329]/60"
              }`}
            >
              INFRA_LOGS
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP INTERFACE (≥ 768px) locked viewport */}
      <div className="hidden md:flex flex-1 overflow-hidden min-h-0">
        
        {/* LEFT COLUMN (Main Control Center - 3/4) */}
        <main className="w-3/4 flex flex-col p-4 space-y-4 min-h-0 bg-[#121214]">
          
          {/* Top Section: Metrics cards with growth arrow indicators */}
          <div className="grid grid-cols-4 gap-4 shrink-0">
            
            <div className="bg-[#1a1a1e] border border-[#2e2e38] p-3 rounded shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Liquid Cash</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-base font-bold text-white">${stats.money.toLocaleString()}</span>
                <span className="text-[10px] text-primary font-bold">▲ active</span>
              </div>
            </div>

            <div className="bg-[#1a1a1e] border border-[#2e2e38] p-3 rounded shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Active Users</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-base font-bold text-white">{stats.users.toLocaleString()}</span>
                <span className="text-[10px] text-primary font-bold">
                  {stats.reputation > 70 ? "▲ +growth" : "▼ -churn"}
                </span>
              </div>
            </div>

            <div className="bg-[#1a1a1e] border border-[#2e2e38] p-3 rounded shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Server Load</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-base font-bold text-white">{(100 - stats.performance)}%</span>
                <span className={`text-[10px] font-bold ${stats.performance < 50 ? "text-[#f43f5e]" : "text-primary/70"}`}>
                  {stats.performance < 50 ? "▲ overloading" : "■ optimized"}
                </span>
              </div>
            </div>

            <div className="bg-[#1a1a1e] border border-[#2e2e38] p-3 rounded shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">System Reputation</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-base font-bold text-white">{stats.reputation}/100</span>
                <span className="text-[10px] text-slate-400 font-bold">SLO: 99.9%</span>
              </div>
            </div>

          </div>

          {/* Middle Section: Tabbed interface for core gameplay (Diagnostics, Incident Control, Analytics, Settings) */}
          <div className="flex-1 flex flex-col min-h-0 bg-[#1a1a1e] border border-[#2e2e38] rounded shadow-sm">
            
            {/* Bento Tab Bar */}
            <div className="flex border-b border-[#2e2e38] bg-[#141417] text-[10px] font-bold select-none shrink-0">
              <button
                onClick={() => { playClick(); setActiveTab("diagnostics"); }}
                className={`px-4 py-2.5 border-r border-[#2e2e38] cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "diagnostics" ? "bg-[#1a1a1e] text-white border-b-2 border-b-primary" : "text-slate-400 hover:bg-[#232329]/40"
                }`}
              >
                <span>[01]</span> DIAGNOSTIC_METRICS
              </button>
              
              <button
                onClick={() => { playClick(); setActiveTab("incidents"); }}
                className={`px-4 py-2.5 border-r border-[#2e2e38] cursor-pointer relative flex items-center gap-1.5 ${
                  activeTab === "incidents" ? "bg-[#1a1a1e] text-white border-b-2 border-b-primary" : "text-slate-400 hover:bg-[#232329]/40"
                }`}
              >
                <span>[02]</span> INCIDENT_CONTROL
                {currentEvent && (
                  <span className="size-2 rounded-full bg-[#f43f5e] animate-ping absolute top-1 right-2"></span>
                )}
              </button>

              <button
                onClick={() => { playClick(); setActiveTab("analytics"); }}
                className={`px-4 py-2.5 border-r border-[#2e2e38] cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "analytics" ? "bg-[#1a1a1e] text-white border-b-2 border-b-primary" : "text-slate-400 hover:bg-[#232329]/40"
                }`}
              >
                <span>[03]</span> ANALYTICS_PLOT
              </button>

              <button
                onClick={() => { playClick(); setActiveTab("settings"); }}
                className={`px-4 py-2.5 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "settings" ? "bg-[#1a1a1e] text-white border-b-2 border-b-primary" : "text-slate-400 hover:bg-[#232329]/40"
                }`}
              >
                <span>[04]</span> CORE_CONFIG
              </button>
            </div>

            {/* Tab viewport container */}
            <div className="flex-grow overflow-y-auto p-4 scroller min-h-0 text-xs">
              
              {activeTab === "diagnostics" && (
                <div className="grid grid-cols-2 gap-8 h-full items-center">
                  
                  {/* Stats list */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-slate-400 text-[10px] mb-1 font-semibold">
                        <span>MARKETING HYPE:</span>
                        <span className="font-bold text-white">{stats.hype}%</span>
                      </div>
                      <TerminalProgress value={stats.hype} length={20} showPercent={false} />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 text-[10px] mb-1 font-semibold">
                        <span>TECHNICAL DEBT RATE:</span>
                        <span className="font-bold text-white">{stats.techDebt}%</span>
                      </div>
                      <TerminalProgress value={stats.techDebt} length={20} showPercent={false} />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 text-[10px] mb-1 font-semibold">
                        <span>ACTIVE INCIDENTS BUG QUEUE:</span>
                        <span className="font-bold text-white">{stats.bugs} bugs</span>
                      </div>
                      <TerminalProgress value={stats.bugs} length={20} showPercent={false} />
                    </div>
                  </div>

                  {/* Informational table */}
                  <div className="border border-[#2e2e38] bg-[#121214] p-3 text-[11px] space-y-2 h-full flex flex-col justify-center">
                    <div className="text-white font-bold border-b border-[#2e2e38] pb-1 uppercase tracking-wide">Diagnostic Checklist</div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Day Duration:</span>
                      <span className="text-white">6000ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tech Debt Penalty:</span>
                      <span className="text-white">{stats.techDebt >= 80 ? "CRITICAL (-4/day)" : stats.techDebt >= 30 ? "ACTIVE (-1/day)" : "NONE"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Load CPU Throttler:</span>
                      <span className="text-white">{stats.users >= 500000 ? "CRITICAL" : stats.users >= 10000 ? "WARM" : "STABLE"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">RNG Difficulty Multiplier:</span>
                      <span className="text-white">{stats.difficulty.toFixed(2)}x</span>
                    </div>
                  </div>

                </div>
              )}

              {activeTab === "incidents" && (
                <div className="h-full flex flex-col justify-center">
                  {currentEvent ? (
                    <div className="space-y-4 max-w-2xl mx-auto border border-[#2e2e38] bg-[#121214] p-4 rounded">
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 bg-[#f43f5e]/15 border border-[#f43f5e] text-[#f43f5e] font-bold text-[10px] uppercase rounded-sm">
                          Severity: {currentEvent.severity}
                        </span>
                        {currentEvent.delayPenalty && (
                          <span className="text-xs text-[#f43f5e] font-bold animate-pulse">
                            ESCALATION PENALTY IN: {countdown.toFixed(1)}s
                          </span>
                        )}
                      </div>
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">{currentEvent.title}</h2>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-mono">{currentEvent.description}</p>
                      
                      {currentEvent.delayPenalty && (
                        <div className="bg-[#f43f5e]/5 border border-[#f43f5e]/25 p-2 rounded text-[10px] text-[#f43f5e]/80">
                          Penalty Effects: {formatEffects(currentEvent.delayPenalty.effects)} / {(currentEvent.delayPenalty.intervalMs / 1000)}s
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
                      <span className="size-2 bg-primary rounded-full animate-ping"></span>
                      <span>SYSTEM STEADY STATED // NO CURRENT INCIDENTS REGISTERED</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="h-full flex flex-col justify-center text-center">
                  {/* Monospace telemetry ASCII trend plots */}
                  <div className="text-left font-mono text-[9px] text-slate-400 space-y-1 w-full max-w-sm mx-auto bg-[#121214] p-4 border border-[#2e2e38] rounded">
                    <div className="text-white font-bold text-[10px] border-b border-[#2e2e38] pb-1 mb-2">USER GROWTH Sparkline (Mocked)</div>
                    <div>1.0M |         _.-*</div>
                    <div>500K |     _.-*    </div>
                    <div>100K | _.-*        </div>
                    <div>  0K |*____________</div>
                    <div className="text-slate-600 border-t border-[#2e2e38] mt-1 pt-1 flex justify-between">
                      <span>D1</span>
                      <span>D15</span>
                      <span>D30</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="grid grid-cols-2 gap-8 h-full items-center">
                  <div className="space-y-4">
                    <div className="text-white font-bold uppercase tracking-wider border-b border-[#2e2e38] pb-1">Client Customizer</div>
                    
                    <div className="space-y-2 text-xs">
                      <span className="text-slate-500 block">Accent Profiles:</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => changeTheme("emerald")}
                          className={`px-2 py-1 border rounded text-[10px] cursor-pointer font-bold uppercase ${
                            activeTheme === "emerald" ? "bg-primary text-[#121214] border-primary" : "border-[#2e2e38] hover:border-slate-500"
                          }`}
                        >
                          emerald
                        </button>
                        <button
                          onClick={() => changeTheme("amber")}
                          className={`px-2 py-1 border rounded text-[10px] cursor-pointer font-bold uppercase ${
                            activeTheme === "amber" ? "bg-primary text-[#121214] border-primary" : "border-[#2e2e38] hover:border-slate-500"
                          }`}
                        >
                          amber
                        </button>
                        <button
                          onClick={() => changeTheme("cyan")}
                          className={`px-2 py-1 border rounded text-[10px] cursor-pointer font-bold uppercase ${
                            activeTheme === "cyan" ? "bg-primary text-[#121214] border-primary" : "border-[#2e2e38] hover:border-slate-500"
                          }`}
                        >
                          cyan
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#121214] border border-[#2e2e38] p-3 rounded text-[10px] space-y-1.5 text-slate-400">
                    <div className="font-bold text-white border-b border-[#2e2e38] pb-1 mb-1">KEYBOARD PROTOCOLS</div>
                    <div>[1], [2], [3] : Select Incident Resolution Path</div>
                    <div>[Enter]       : Trigger Simulator Startup</div>
                    <div>[Theme Selector]: Updates CSS Variable mapping</div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Bottom Section: Interactive Command Line Prompt (Warp/Ghostty style) */}
          <div className="bg-[#1a1a1e] border border-[#2e2e38] p-3 rounded shrink-0 shadow-sm space-y-2.5">
            
            <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-500 font-bold shrink-0">agy@saas-os:~$</span>
              <input
                ref={promptInputRef}
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder={currentEvent ? "Type '1', '2', or '3' to resolve incident..." : "Ticking days... CLI prompt idle."}
                disabled={!currentEvent}
                className="flex-1 bg-transparent border-none outline-none font-mono text-white placeholder-slate-600 focus:ring-0 focus:outline-none p-0"
              />
              <button type="submit" className="hidden" />
            </form>

            {/* Suggestions Palette */}
            {currentEvent ? (
              <div className="flex flex-wrap items-center gap-2 border-t border-[#2e2e38] pt-2 text-[10px]">
                <span className="text-slate-500 font-bold">SUGGESTIONS:</span>
                {currentEvent.choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      playClick();
                      choose(i);
                    }}
                    className="px-2 py-0.5 border border-[#2e2e38] hover:border-primary text-slate-300 hover:text-white rounded bg-[#121214] cursor-pointer text-[10px]"
                  >
                    {i + 1}: resolve --option-{i + 1} ({choice.text.toLowerCase().replace(/ /g, "-")})
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-[10px] text-slate-600 border-t border-[#2e2e38] pt-2">
                STATUS: Listening for deployment incidents...
              </div>
            )}

          </div>

        </main>

        {/* RIGHT COLUMN (Live Environment Simulator - 1/4) */}
        <aside className="w-1/4 flex flex-col p-4 space-y-4 min-h-0 bg-[#16161a] border-l border-[#2e2e38] shrink-0">
          
          {/* Upper Section: System resource monitors */}
          <TerminalPanel title="sys_monitor" className="py-2.5 px-3 shrink-0" showControls={false}>
            <div className="text-[10px] font-mono space-y-2">
              <div>
                <div className="flex justify-between text-slate-500 mb-0.5">
                  <span>CPU_LOAD:</span>
                  <span className="font-bold text-white">{cpu.toFixed(1)}%</span>
                </div>
                <div className="text-primary font-bold text-[9px] tracking-widest">{getSysBar(cpu)}</div>
              </div>
              
              <div>
                <div className="flex justify-between text-slate-500 mb-0.5">
                  <span>RAM_USAGE:</span>
                  <span className="font-bold text-white">{ram.toFixed(2)} GB</span>
                </div>
                <div className="text-primary font-bold text-[9px] tracking-widest">{getSysBar((ram/16)*100)}</div>
              </div>

              <div className="border-t border-[#2e2e38] pt-2 mt-2 flex justify-between items-center text-[9px]">
                <span className="text-slate-500">DAEMON:</span>
                <span className="text-primary font-bold uppercase">[STABLE]</span>
              </div>
            </div>
          </TerminalPanel>

          {/* Lower Section: Live-scrolling, color-coded stream log */}
          <TerminalPanel title="live_telemetry_stream" className="flex-grow min-h-0" showControls={false}>
            <div className="flex-1 overflow-y-auto scroller font-mono text-[9px] space-y-1.5 pr-1 min-h-0 leading-normal">
              {logs.map((log, idx) => (
                <div key={idx} className="break-all select-text">
                  <span className="text-slate-600 mr-1.5 font-normal">[{log.timestamp}]</span>
                  <span className={getLogColorClass(log.type)}>{log.message}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
            
            {/* Prompt blinking signoff */}
            <div className="border-t border-[#2e2e38] pt-2 text-[9px] text-slate-600 shrink-0 select-none flex items-center justify-between">
              <span>stream // active</span>
              <span className="animate-pulse bg-primary/40 size-1 rounded-sm cursor-blink inline-block">_</span>
            </div>
          </TerminalPanel>

        </aside>

      </div>

      <FeedbackPopup />
    </div>
  );
}
