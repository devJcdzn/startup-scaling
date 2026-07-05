"use client";

import type { CampaignResult } from "@/game/growth/campaigns";
import { useGameStore } from "@/game/store/game-store";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const OUTCOME_STYLES: Record<
  string,
  { bg: string; border: string; label: string; color: string }
> = {
  success: {
    bg: "bg-[#22c55e]/10",
    border: "border-[#22c55e]/30",
    label: "SUCCESS",
    color: "#22c55e",
  },
  neutral: {
    bg: "bg-[#f59e0b]/10",
    border: "border-[#f59e0b]/30",
    label: "NEUTRAL",
    color: "#f59e0b",
  },
  failure: {
    bg: "bg-[#ef4444]/10",
    border: "border-[#ef4444]/30",
    label: "FAILURE",
    color: "#ef4444",
  },
  backfire: {
    bg: "bg-[#dc2626]/10",
    border: "border-[#dc2626]/30",
    label: "BACKFIRE",
    color: "#dc2626",
  },
};

export function CampaignResultToast() {
  const result = useGameStore((s) => s.lastCampaignResult);
  const dismiss = useGameStore((s) => s.dismissCampaignResult);

  useEffect(() => {
    if (result) {
      const timeout = setTimeout(dismiss, 5000);
      return () => clearTimeout(timeout);
    }
  }, [result, dismiss]);

  return (
    <AnimatePresence>
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 w-full max-w-sm"
        >
          <div
            className={`${OUTCOME_STYLES[result.outcome].bg} border ${OUTCOME_STYLES[result.outcome].border} p-4 rounded-lg shadow-xl cursor-pointer`}
            onClick={dismiss}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: `${OUTCOME_STYLES[result.outcome].color}20`,
                  color: OUTCOME_STYLES[result.outcome].color,
                }}
              >
                {OUTCOME_STYLES[result.outcome].label}
              </span>
              <span className="text-xs font-medium text-[#fafafa]">
                Campaign {result.outcome}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#a1a1aa]">Users Acquired</span>
                <span className="font-bold text-[#fafafa]">
                  +{result.acquiredUsers.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a1a1aa]">Paying Users</span>
                <span className="font-bold text-[#3b82f6]">
                  +{result.payingUsers.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a1a1aa]">CAC</span>
                <span className="font-bold text-[#fafafa]">
                  ${Math.round(result.cac)}
                </span>
              </div>
            </div>

            {result.outcome === "backfire" && (
              <div className="mt-2 text-[10px] text-[#ef4444] border-t border-[#ef4444]/20 pt-2">
                The product was not ready for paid traffic. Stability and reputation suffered.
              </div>
            )}

            {result.outcome === "failure" && (
              <div className="mt-2 text-[10px] text-[#f59e0b] border-t border-[#f59e0b]/20 pt-2">
                Campaign underperformed due to low readiness.
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
