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

      const timeout = setTimeout(dismissFeedback, 2000);
      return () => clearTimeout(timeout);
    }
  }, [pendingEffects, dismissFeedback, playSuccess, playError]);

  if (!pendingEffects) return null;

  const hasNegative = pendingEffects.some((e) =>
    Object.values(e).some((v) => v < 0)
  );

  return (
    <AnimatePresence>
      {pendingEffects && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -5, scale: 0.98 }}
          transition={{ duration: 0.12 }}
          className="fixed bottom-6 right-6 z-50 w-full max-w-sm"
        >
          <div
            className={`bg-[#1e1e24] border ${
              hasNegative ? "border-[#f43f5e]/60" : "border-primary/60"
            } p-3 shadow-xl cursor-pointer select-none rounded flex items-start gap-2.5 font-mono`}
            onClick={dismissFeedback}
          >
            {hasNegative ? (
              <span className="text-[#f43f5e] font-bold text-xs uppercase shrink-0 bg-[#f43f5e]/10 px-1 border border-[#f43f5e]/30">
                [WARN]
              </span>
            ) : (
              <span className="text-primary font-bold text-xs uppercase shrink-0 bg-primary/10 px-1 border border-primary/30">
                [SUCCESS]
              </span>
            )}
            <div className="flex-1 text-[11px] text-[#e2e8f0]">
              <div className="font-bold text-slate-300 mb-1">
                {hasNegative ? "SYSTEM DEGRADED" : "OPTIMIZATION COMPLETED"}
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                {pendingEffects.map((effect, i) =>
                  Object.entries(effect).map(([key, value]) => {
                    const isPositive = value > 0;
                    return (
                      <span
                        key={`${i}-${key}`}
                        className={isPositive ? "text-primary font-semibold" : "text-[#f43f5e] font-semibold"}
                      >
                        {formatEffect(key, value)}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
