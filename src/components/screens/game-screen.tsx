"use client";

import { useGameStore, useGameStats, useGameEvent } from "@/game/store/game-store";
import { useGameLoop } from "@/hooks/use-game-loop";
import { TopBar } from "@/components/game/top-bar";
import { MetricsGrid } from "@/components/game/metrics-grid";
import { CurrentEventPanel } from "@/components/game/current-event-panel";
import { ActivityLogPanel } from "@/components/game/activity-log-panel";
import { DecisionForecastPanel } from "@/components/game/panels/decision-forecast-panel";
import { ActiveEffectsPanel } from "@/components/game/panels/active-effects-panel";
import { FeedbackPopup } from "@/components/feedback/feedback-popup";
import { useSound } from "@/hooks/use-sound";
import { useTerminalLogs, addTerminalLog } from "@/hooks/use-terminal-logs";
import { useState, useEffect, useRef } from "react";

// Modal dialog imports
import { HowToPlayDialog } from "@/components/game/dialogs/how-to-play-dialog";
import { ConfirmDecisionDialog } from "@/components/game/dialogs/confirm-decision-dialog";
import { PauseDialog } from "@/components/game/dialogs/pause-dialog";
import { RestartRunDialog } from "@/components/game/dialogs/restart-run-dialog";

interface Choice {
  text: string;
  effects: Record<string, number>;
}

export function GameScreen() {
  useGameLoop();

  const state = useGameStore();
  const stats = useGameStats();
  const { currentEvent, lastPenaltyTime } = useGameEvent();
  const choose = useGameStore((s) => s.choose);
  const { playClick } = useSound();
  const logs = useTerminalLogs();

  // Dialog States
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [isRestartOpen, setIsRestartOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Choice Selection States for Forecast and Confirmation
  const [hoveredChoice, setHoveredChoice] = useState<Record<string, number> | null>(null);
  const [selectedChoiceObject, setSelectedChoiceObject] = useState<Choice | null>(null);

  // Day 1 initial Launch Day choice resolution state
  const [launchDayResolved, setLaunchDayResolved] = useState(false);

  // Pausing Ref trackers
  const pausedStatusRef = useRef<any>("running");
  const pausedTimeScaleRef = useRef<number>(1.0);

  // Reset Launch day choice flag on game restart
  useEffect(() => {
    if (stats.day === 1 && !currentEvent) {
      setLaunchDayResolved(false);
    }
  }, [stats.day, currentEvent]);

  // Keyboard shortcut selectors for active event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.status === "decision" && currentEvent && !isHelpOpen && !isPauseOpen && !isRestartOpen && !isConfirmOpen) {
        const choiceIndex = parseInt(e.key, 10) - 1;
        if (choiceIndex >= 0 && choiceIndex < currentEvent.choices.length) {
          playClick();
          const choice = currentEvent.choices[choiceIndex];
          setSelectedChoiceObject(choice);
          setIsConfirmOpen(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.status, currentEvent, isHelpOpen, isPauseOpen, isRestartOpen, isConfirmOpen, playClick]);

  // Pause Handlers
  const handlePause = () => {
    playClick();
    if (state.status !== "idle") {
      pausedStatusRef.current = state.status;
      pausedTimeScaleRef.current = state.timeScale;
      useGameStore.setState({ status: "idle", timeScale: 0 });
      setIsPauseOpen(true);
    }
  };

  const handleResume = () => {
    playClick();
    useGameStore.setState({ status: pausedStatusRef.current, timeScale: pausedTimeScaleRef.current });
    setIsPauseOpen(false);
  };

  // Restart Handlers
  const handleRestartTrigger = () => {
    playClick();
    setIsRestartOpen(true);
  };

  const handleConfirmRestart = () => {
    playClick();
    setIsRestartOpen(false);
    setIsPauseOpen(false);
    state.restart();
  };

  // Apply chosen decision effects
  const handleConfirmExecute = () => {
    if (!selectedChoiceObject) return;
    playClick();
    setIsConfirmOpen(false);

    // 1. If active event is resolved
    if (currentEvent) {
      const idx = currentEvent.choices.findIndex((c) => c.text === selectedChoiceObject.text);
      if (idx !== -1) {
        choose(idx);
        setSelectedChoiceObject(null);
        return;
      }
    }

    // 2. If it's a standard/available action
    applyStandardAction(selectedChoiceObject);
    setSelectedChoiceObject(null);
  };

  // Mutate store parameters for available standard choices
  const applyStandardAction = (choice: Choice) => {
    const effects = choice.effects;
    const s = useGameStore.getState();
    useGameStore.setState({
      money: Math.max(0, s.money + (effects.money || 0)),
      performance: Math.max(0, Math.min(100, s.performance + (effects.performance || 0))),
      reputation: Math.max(0, Math.min(100, s.reputation + (effects.reputation || 0))),
      hype: Math.max(0, Math.min(100, s.hype + (effects.hype || 0))),
      techDebt: Math.max(0, Math.min(100, s.techDebt + (effects.techDebt || 0))),
      bugs: Math.max(0, Math.min(100, s.bugs + (effects.bugs || 0))),
      users: Math.max(0, s.users + (effects.users || 0)),
      mrr: Math.max(0, s.mrr + (effects.money ? Math.round(effects.money * 0.05) : 0)),
    });
    addTerminalLog("success", `Day ${s.day} · Executed action: ${choice.text}`);
  };

  // Launch Day Day 1 Choice Handler
  const handleResolveLaunchDay = (effects: Record<string, number>) => {
    const s = useGameStore.getState();
    useGameStore.setState({
      hype: Math.max(0, s.hype + (effects.hype || 0)),
      users: Math.max(0, s.users + (effects.users || 0)),
      performance: Math.max(0, Math.min(100, s.performance + (effects.performance || 0))),
      techDebt: Math.max(0, Math.min(100, s.techDebt + (effects.techDebt || 0))),
    });
    setLaunchDayResolved(true);
    addTerminalLog("success", "Day 1 · Launch Day focus chosen. Simulation running.");
  };

  // Delay penalty countdown
  const [countdown, setCountdown] = useState<number>(0);
  useEffect(() => {
    if (!currentEvent || !currentEvent.delayPenalty || state.status === "idle") return;

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
  }, [currentEvent, lastPenaltyTime, state.status]);

  const dayProgress = (stats.day / 30) * 100;

  return (
    <div className="h-dvh w-screen flex flex-col bg-[#0b0b0f] font-sans text-[#f3f4f6] selection:bg-[#10b981] selection:text-[#0b0b0f] overflow-hidden select-none">
      
      {/* Top Bar Navigation */}
      <TopBar
        day={stats.day}
        timeScale={stats.timeScale}
        dayProgress={dayProgress}
        hasEvent={!!currentEvent}
        onPause={handlePause}
        onRestart={handleRestartTrigger}
        onHelp={() => { playClick(); setIsHelpOpen(true); }}
      />

      {/* Main Container Dashboard layout */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#0b0b0f]">
        
        {/* KPI Dashboard metrics header (restored compact cards) */}
        <MetricsGrid stats={stats} activeEffects={hoveredChoice} />

        {/* Central Split Workspace Panels */}
        <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[1.4fr_0.75fr] gap-3 p-3 overflow-hidden">
          
          {/* LEFT: Current Event / Current Situation & Available Actions */}
          <div className="min-h-0 flex flex-col overflow-hidden">
            <CurrentEventPanel
              currentEvent={currentEvent}
              countdown={countdown}
              onChooseChoice={(choice) => {
                setSelectedChoiceObject(choice);
                setIsConfirmOpen(true);
              }}
              onHoverChoice={setHoveredChoice}
              stats={stats}
              playClick={playClick}
              launchDayResolved={launchDayResolved}
              onResolveLaunchDay={handleResolveLaunchDay}
            />
          </div>

          {/* RIGHT: Decision Forecast, Active Effects & Timeline Logs */}
          <div className="min-h-0 flex flex-col gap-3 overflow-hidden">
            <DecisionForecastPanel
              effects={hoveredChoice}
              stats={stats}
            />
            <ActiveEffectsPanel stats={stats} />
            <div className="flex-1 min-h-0 flex flex-col">
              <ActivityLogPanel logs={logs} />
            </div>
          </div>

        </div>

      </main>

      {/* MODALS FLOW */}
      <HowToPlayDialog
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <ConfirmDecisionDialog
        isOpen={isConfirmOpen}
        choice={selectedChoiceObject}
        isCritical={currentEvent ? currentEvent.severity === "critical" || currentEvent.severity === "high" : false}
        onCancel={() => {
          setIsConfirmOpen(false);
          setSelectedChoiceObject(null);
        }}
        onConfirm={handleConfirmExecute}
        stats={stats}
      />

      <PauseDialog
        isOpen={isPauseOpen}
        day={stats.day}
        users={stats.users}
        cash={stats.money}
        mrr={stats.mrr}
        onResume={handleResume}
        onRestart={handleConfirmRestart}
        onMainMenu={() => {
          playClick();
          setIsPauseOpen(false);
          useGameStore.setState({ status: "idle" });
        }}
      />

      <RestartRunDialog
        isOpen={isRestartOpen}
        day={stats.day}
        users={stats.users}
        cash={stats.money}
        onCancel={() => setIsRestartOpen(false)}
        onConfirm={handleConfirmRestart}
      />

      <FeedbackPopup />
    </div>
  );
}
