"use client";

import type { DecisionForecast, ForecastItem } from "@/game/decisions/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ForecastPanelProps {
  forecast: DecisionForecast | null;
}

function ForecastRow({ item }: { item: ForecastItem }) {
  const meaningColor =
    item.meaning === "good"
      ? "#22c55e"
      : item.meaning === "bad"
        ? "#ef4444"
        : item.meaning === "mixed"
          ? "#f59e0b"
          : "#a1a1aa";

  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-[#a1a1aa]">{item.label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[#52525b]">{item.before}</span>
        <span className="text-[#52525b]">→</span>
        <span className="font-bold" style={{ color: meaningColor }}>
          {item.after}
        </span>
      </div>
    </div>
  );
}

export function ForecastPanel({ forecast }: ForecastPanelProps) {
  if (!forecast) {
    return (
      <Card className="bg-[#18181b] border-[#27272a]">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold text-[#52525b] uppercase tracking-wider">
            Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-[#52525b]">
            Hover over a decision to see its projected impact.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#18181b] border-[#27272a]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">
          Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-[10px] text-[#52525b]">{forecast.summary}</p>
        <div className="space-y-1.5">
          {forecast.items.map((item, i) => (
            <ForecastRow key={i} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
