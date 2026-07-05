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

function getToastInfo(effects: Record<string, number>[]) {
  const allEffects = effects.flatMap((e) => Object.entries(e));
  const positives = allEffects.filter(([, v]) => v > 0);
  const negatives = allEffects.filter(([, v]) => v < 0);

  if (positives.length > 0 && negatives.length === 0) {
    return {
      badge: "INVESTMENT",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      border: "border-emerald-500/60",
      title: "Investment executed",
    };
  }

  if (positives.length > 0 && negatives.length > 0) {
    return {
      badge: "TRADE-OFF",
      badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      border: "border-amber-500/60",
      title: "Trade-off accepted",
    };
  }

  return {
    badge: "INCIDENT",
    badgeColor: "text-[#f43f5e] bg-[#f43f5e]/10 border-[#f43f5e]/30",
    border: "border-[#f43f5e]/60",
    title: "Incident worsened",
  };
}

export function FeedbackPopup() {
  const pendingEffects = useGameStore((s) => s.pendingEffects);
  const currentEvent = useGameStore((s) => s.currentEvent);
  const dismissFeedback = useGameStore((s) => s.dismissFeedback);
  const { playSuccess, playError } = useSound();

  useEffect(() => {
    if (pendingEffects) {
      const hasNegative = pendingEffects.some((e) =>
        Object.values(e).some((v) => v < 0)
      );
      if (hasNegative) playError();
      else playSuccess();

      const timeout = setTimeout(dismissFeedback, 3000);
      return () => clearTimeout(timeout);
    }
  }, [pendingEffects, dismissFeedback, playSuccess, playError]);

  if (!pendingEffects) return null;

  const toastInfo = getToastInfo(pendingEffects);

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
            className={`bg-[#1e1e24] border ${toastInfo.border} p-3 shadow-xl cursor-pointer select-none rounded flex items-start gap-2.5 font-mono`}
            onClick={dismissFeedback}
          >
            <span className={`font-bold text-xs uppercase shrink-0 px-1 border ${toastInfo.badgeColor}`}>
              [{toastInfo.badge}]
            </span>
            <div className="flex-1 text-[11px] text-[#e2e8f0]">
              <div className="font-bold text-slate-300 mb-1">
                {toastInfo.title}
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                {pendingEffects.map((effect, i) =>
                  Object.entries(effect).map(([key, value]) => {
                    const isPositive = value > 0;
                    return (
                      <span
                        key={`${i}-${key}`}
                        className={isPositive ? "text-emerald-400 font-semibold" : "text-[#f43f5e] font-semibold"}
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
