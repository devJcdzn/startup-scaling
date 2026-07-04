"use client";

import { useGameStore } from "@/game/store/game-store";
import { useSound } from "@/hooks/use-sound";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

function formatEffect(key: string, value: number): string {
  const sign = value > 0 ? "+" : "";
  const label = key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase());
  return `${sign}${value} ${label}`;
}

export function FeedbackPopup() {
  const pendingEffects = useGameStore((s) => s.pendingEffects);
  const dismissFeedback = useGameStore((s) => s.dismissFeedback);
  const { playSuccess, playError } = useSound();

  useEffect(() => {
    if (pendingEffects) {
      const hasNegative = pendingEffects.some((e) =>
        Object.values(e).some((v) => v < 0)
      );
      if (hasNegative) playError();
      else playSuccess();

      const timeout = setTimeout(dismissFeedback, 2500);
      return () => clearTimeout(timeout);
    }
  }, [pendingEffects, dismissFeedback, playSuccess, playError]);

  return (
    <AnimatePresence>
      {pendingEffects && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className="bg-[#18181b] border border-[#27272a] rounded-lg px-6 py-4 shadow-2xl cursor-pointer"
            onClick={dismissFeedback}
          >
            <div className="flex flex-wrap gap-3 justify-center">
              {pendingEffects.map((effect, i) =>
                Object.entries(effect).map(([key, value]) => (
                  <motion.span
                    key={`${i}-${key}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`text-sm font-bold px-3 py-1 rounded-full ${
                      value > 0
                        ? "bg-[#22c55e]/10 text-[#22c55e]"
                        : "bg-[#ef4444]/10 text-[#ef4444]"
                    }`}
                  >
                    {formatEffect(key, value)}
                  </motion.span>
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
