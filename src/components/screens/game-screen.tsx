"use client";

import { useGameStore, useGameStats, useGameEvent } from "@/game/store/game-store";
import { useGameLoop } from "@/hooks/use-game-loop";
import { TopBar } from "@/components/game/top-bar";
import { CashflowCard } from "@/components/game/cashflow-card";
import { RevenueCard } from "@/components/game/revenue-card";
import { ProductHealthCard } from "@/components/game/product-health-card";
import { GrowthCard } from "@/components/game/growth-card";
import { CurrentEventCard } from "@/components/game/current-event-card";
import { ActivityLog } from "@/components/game/activity-log";
import { ThresholdAlert } from "@/components/game/threshold-alert";
import { FeedbackPopup } from "@/components/feedback/feedback-popup";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function GameScreen() {
  useGameLoop();

  const stats = useGameStats();
  const { currentEvent, lastPenaltyTime } = useGameEvent();
  const choose = useGameStore((s) => s.choose);
  const status = useGameStore((s) => s.status);

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

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b]">
      <TopBar
        day={stats.day}
        timeScale={stats.timeScale}
        status={status}
        countdown={currentEvent?.delayPenalty ? countdown : undefined}
      />

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-4 space-y-4">
        <ThresholdAlert />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <CashflowCard
            money={stats.money}
            dailyRevenue={stats.dailyRevenue}
            dailyExpenses={stats.dailyExpenses}
            dailyBalance={stats.dailyBalance}
            runwayDays={stats.runwayDays}
          />
          <RevenueCard
            users={stats.users}
            payingUsers={stats.payingUsers}
            conversionRate={stats.conversionRate}
            arpu={stats.arpu}
            mrr={stats.mrr}
          />
          <ProductHealthCard
            performance={stats.performance}
            reputation={stats.reputation}
            bugs={stats.bugs}
            techDebt={stats.techDebt}
          />
          <GrowthCard
            users={stats.users}
            newUsersToday={stats.newUsersToday}
            hype={stats.hype}
          />
        </div>

        <AnimatePresence mode="wait">
          {currentEvent && (
            <CurrentEventCard
              key={currentEvent.id}
              event={currentEvent}
              onChoose={choose}
            />
          )}
        </AnimatePresence>

        <ActivityLog />
      </div>

      <FeedbackPopup />
    </div>
  );
}
