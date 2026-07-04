"use client";

import { useGameStore, useGameStats, useGameEvent } from "@/game/store/game-store";
import { useGameLoop } from "@/hooks/use-game-loop";
import { TopBar } from "@/components/game/top-bar";
import { MetricsGrid } from "@/components/game/metrics-grid";
import { CurrentEventPanel } from "@/components/game/current-event-panel";
import { ActivityLogPanel } from "@/components/game/activity-log-panel";
import { FeedbackPopup } from "@/components/feedback/feedback-popup";
import { useSound } from "@/hooks/use-sound";
import { useTerminalLogs, addTerminalLog } from "@/hooks/use-terminal-logs";
import { useState, useEffect, useRef } from "react";

export function GameScreen() {
  useGameLoop();

  const state = useGameStore();
  const stats = useGameStats();
  const { currentEvent, lastPenaltyTime } = useGameEvent();
  const choose = useGameStore((s) => s.choose);
  const { playClick } = useSound();
  const logs = useTerminalLogs();

  // Tabs: "growth" | "product" | "funding"
  const [activeTab, setActiveTab] = useState<"growth" | "product" | "funding">("growth");

  // Mobile Tab selector: "core" | "alerts" | "feed"
  const [mobileTab, setMobileTab] = useState<"core" | "alerts" | "feed">("core");

  // Custom theme controls
  const [activeTheme, setActiveTheme] = useState<"emerald" | "amber" | "cyan">("emerald");

  // Hover state for consequences preview
  const [hoveredChoice, setHoveredChoice] = useState<number | null>(null);
  const activeEffects = hoveredChoice !== null && currentEvent ? currentEvent.choices[hoveredChoice].effects : null;

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

  // Focus mobile alerts tab when a new event triggers
  useEffect(() => {
    if (currentEvent) {
      setMobileTab("alerts");
    }
  }, [currentEvent]);

  // Keyboard controls for event choices
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.status === "decision" && currentEvent) {
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

  return (
    <div className="h-dvh w-screen flex flex-col bg-[#0b0b0f] font-mono text-[#f3f4f6] selection:bg-[#10b981] selection:text-[#0b0b0f] overflow-hidden">
      
      {/* Top Fixed Bar (56px) */}
      <TopBar
        day={stats.day}
        timeScale={stats.timeScale}
        dayProgress={dayProgress}
        hasEvent={!!currentEvent}
      />

      {/* Main Content Area: Fills remaining height perfectly without scrolling */}
      <main className="flex-1 grid h-[calc(100dvh-56px)] grid-rows-[auto_1fr] gap-3 p-3 min-h-0 overflow-hidden">
        
        {/* Superior Metrics Grid Bar */}
        <MetricsGrid stats={stats} activeEffects={activeEffects} />

        {/* Lower Main Panels (Desktop: Split, Mobile: Stack/Tabbed) */}
        <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[1.35fr_0.65fr] gap-3 overflow-hidden">
          
          {/* LEFT: Current Event & Department Panel */}
          <div className="min-h-0 flex flex-col overflow-hidden">
            <CurrentEventPanel
              currentEvent={currentEvent}
              countdown={countdown}
              onChoose={choose}
              onHoverChoice={setHoveredChoice}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              stats={stats}
              changeTheme={changeTheme}
              activeTheme={activeTheme}
              playClick={playClick}
            />
          </div>

          {/* RIGHT: Scrollable Startup Activity Log */}
          <div className="min-h-0 flex flex-col overflow-hidden hidden xl:flex">
            <ActivityLogPanel logs={logs} />
          </div>

        </div>

      </main>

      <FeedbackPopup />
    </div>
  );
}
