"use client";

import { useState, useEffect, useRef } from "react";
import { useGameStore } from "@/game/store/game-store";

export interface LogEntry {
  timestamp: string;
  type: "system" | "user" | "cash" | "warn" | "critical" | "success";
  message: string;
}

let globalLogs: LogEntry[] = [
  { timestamp: "00:00:00", type: "system", message: "OS Boot sequence complete." },
  { timestamp: "00:00:01", type: "system", message: "Connected to SaaS DB at dynamic-db-01." },
  { timestamp: "00:00:02", type: "system", message: "Starting server daemon on port 8080..." },
  { timestamp: "00:00:03", type: "success", message: "SaaS Online. Day 1 begun." }
];

let listeners: Array<(logs: LogEntry[]) => void> = [];

function emitLogs() {
  listeners.forEach((l) => l([...globalLogs]));
}

export function addTerminalLog(type: LogEntry["type"], message: string) {
  const time = new Date();
  const timestamp = time.toTimeString().split(" ")[0]; // HH:MM:SS
  globalLogs.push({ timestamp, type, message });
  if (globalLogs.length > 50) {
    globalLogs.shift();
  }
  emitLogs();
}

export function clearTerminalLogs() {
  globalLogs = [
    { timestamp: "00:00:00", type: "system", message: "SaaS Simulator Resetting..." },
    { timestamp: "00:00:01", type: "system", message: "Initializing game state metrics..." },
    { timestamp: "00:00:02", type: "success", message: "SaaS Online. Day 1 begun." }
  ];
  emitLogs();
}

export function useTerminalLogs() {
  const [logs, setLogs] = useState<LogEntry[]>(globalLogs);

  useEffect(() => {
    listeners.push(setLogs);
    return () => {
      listeners = listeners.filter((l) => l !== setLogs);
    };
  }, []);

  const lastStateRef = useRef<{
    day: number;
    users: number;
    money: number;
    eventId: string | null;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = useGameStore.subscribe((state) => {
      if (state.status === "idle") {
        return;
      }

      if (!lastStateRef.current) {
        lastStateRef.current = {
          day: state.day,
          users: state.users,
          money: state.money,
          eventId: state.currentEvent?.id ?? null,
        };
        return;
      }

      const prev = lastStateRef.current;
      const cur = {
        day: state.day,
        users: state.users,
        money: state.money,
        eventId: state.currentEvent?.id ?? null,
      };

      // 1. Day change
      if (cur.day !== prev.day) {
        const cost = Math.floor(50 + prev.users / 100);
        addTerminalLog("system", `DAY ${cur.day} INITIATED. Operational cost: -$${cost}.`);
      }

      // 2. Event triggered
      if (cur.eventId && cur.eventId !== prev.eventId) {
        const event = state.currentEvent;
        if (event) {
          addTerminalLog("critical", `ALERT: ${event.title.toUpperCase()} (Severity: ${event.severity.toUpperCase()})`);
          addTerminalLog("warn", `DETAILS: ${event.description}`);
        }
      }

      // 3. Event resolved (choice made)
      if (prev.eventId && !cur.eventId) {
        addTerminalLog("success", `Choice executed successfully. System stabilized.`);
      }

      // 4. Money changes
      if (cur.money !== prev.money) {
        const diff = cur.money - prev.money;
        const isPositive = diff >= 0;
        const type = isPositive ? "success" : "warn";
        const prefix = isPositive ? "+" : "-";
        addTerminalLog("cash", `Cashflow update: ${prefix}$${Math.abs(diff)} (Balance: $${cur.money})`);
      }

      // 5. Users changes
      if (cur.users !== prev.users) {
        const diff = cur.users - prev.users;
        if (diff > 0) {
          addTerminalLog("user", `User signups: +${diff} (Total active: ${cur.users})`);
        } else if (diff < 0) {
          addTerminalLog("warn", `User churn: ${diff} (Total active: ${cur.users})`);
        }
      }

      lastStateRef.current = cur;
    });

    return () => unsubscribe();
  }, []);

  return logs;
}
