"use client";

import { useGameStore } from "@/game/store/game-store";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { STRINGS } from "@/game/content/strings";

export function ThresholdAlert() {
  const [alert, setAlert] = useState<string | null>(null);
  const performance = useGameStore((s) => s.performance);
  const reputation = useGameStore((s) => s.reputation);
  const techDebt = useGameStore((s) => s.techDebt);
  const bugs = useGameStore((s) => s.bugs);
  const runwayDays = useGameStore((s) => s.runwayDays);
  const dailyBalance = useGameStore((s) => s.dailyBalance);

  useEffect(() => {
    if (performance <= 40 && performance > 20) {
      setAlert(STRINGS.alerts.performanceWarning);
    } else if (performance <= 20) {
      setAlert(STRINGS.alerts.performanceCritical);
    } else if (reputation <= 40 && reputation > 20) {
      setAlert(STRINGS.alerts.reputationWarning);
    } else if (reputation <= 20) {
      setAlert(STRINGS.alerts.reputationCritical);
    } else if (techDebt > 70) {
      setAlert(STRINGS.alerts.techDebtCritical);
    } else if (techDebt > 30) {
      setAlert(STRINGS.alerts.techDebtWarning);
    } else if (bugs > 40) {
      setAlert(STRINGS.alerts.bugsCritical);
    } else if (bugs > 10) {
      setAlert(STRINGS.alerts.bugsWarning);
    } else if (
      dailyBalance < 0 &&
      runwayDays !== "profitable" &&
      runwayDays <= 5
    ) {
      setAlert(STRINGS.alerts.runwayCritical);
    } else if (
      dailyBalance < 0 &&
      runwayDays !== "profitable" &&
      runwayDays <= 15
    ) {
      setAlert(STRINGS.alerts.runwayWarning);
    } else {
      setAlert(null);
    }
  }, [performance, reputation, techDebt, bugs, runwayDays, dailyBalance]);

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg px-4 py-2 text-xs text-[#f59e0b]"
        >
          {alert}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
