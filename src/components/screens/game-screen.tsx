"use client";

import { HUD } from "@/components/dashboard/hud";
import { EventCard } from "@/components/event/event-card";
import { FeedbackPopup } from "@/components/feedback/feedback-popup";
import { useGameStore } from "@/game/store/game-store";
import { useGameLoop } from "@/hooks/use-game-loop";
import { AnimatePresence } from "framer-motion";

export function GameScreen() {
  useGameLoop();

  const currentEvent = useGameStore((s) => s.currentEvent);
  const choose = useGameStore((s) => s.choose);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 py-6 space-y-6">
        <HUD />

        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <AnimatePresence mode="wait">
            {currentEvent && (
              <EventCard
                key={currentEvent.id}
                event={currentEvent}
                onChoose={choose}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <FeedbackPopup />
    </div>
  );
}
