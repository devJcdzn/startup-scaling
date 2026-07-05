"use client";

import type { GrowthAction } from "@/game/growth/campaigns";
import type { GameState } from "@/game/types";
import { calculateAcquisitionReadiness, getReadinessStatus, getReadinessFactors } from "@/game/growth/readiness";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CampaignForecastProps {
  action: GrowthAction;
  state: GameState;
  onExecute: () => void;
  onCancel: () => void;
}

const READINESS_COLORS: Record<string, string> = {
  strong: "#22c55e",
  medium: "#f59e0b",
  weak: "#ef4444",
  dangerous: "#dc2626",
};

export function CampaignForecast({
  action,
  state,
  onExecute,
  onCancel,
}: CampaignForecastProps) {
  const readiness = calculateAcquisitionReadiness(state);
  const status = getReadinessStatus(readiness);
  const factors = getReadinessFactors(state);

  const minUsers = Math.floor(action.trafficPotential.min * readiness * 0.65);
  const maxUsers = Math.floor(action.trafficPotential.max * readiness * 1.2);
  const minPaying = Math.floor(minUsers * state.conversionRate);
  const maxPaying = Math.floor(maxUsers * state.conversionRate);
  const minCac = action.cost / Math.max(maxPaying, 1);
  const maxCac = action.cost / Math.max(minPaying, 1);

  const riskLevel =
    status === "dangerous"
      ? "Very High"
      : status === "weak"
        ? "High"
        : status === "medium"
          ? "Medium"
          : "Low";

  return (
    <Card className="bg-[#18181b] border-[#27272a]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">
          Campaign Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm font-medium text-[#fafafa]">{action.label}</div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[#a1a1aa]">Budget</span>
            <div className="font-bold text-[#fafafa]">${action.cost.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-[#a1a1aa]">Expected Users</span>
            <div className="font-bold text-[#fafafa]">
              {minUsers.toLocaleString()}–{maxUsers.toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-[#a1a1aa]">Paying Users</span>
            <div className="font-bold text-[#3b82f6]">
              {minPaying.toLocaleString()}–{maxPaying.toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-[#a1a1aa]">Est. CAC</span>
            <div className="font-bold text-[#fafafa]">
              ${Math.round(minCac)}–${Math.round(maxCac)}
            </div>
          </div>
        </div>

        <div className="border-t border-[#27272a] pt-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[#a1a1aa]">Acquisition Readiness</span>
            <span
              className="font-bold uppercase"
              style={{ color: READINESS_COLORS[status] }}
            >
              {status}
            </span>
          </div>
          <div className="text-[10px] text-[#52525b]">
            Score: {readiness.toFixed(2)}
          </div>
        </div>

        {factors.length > 0 && (
          <div className="space-y-1">
            <span className="text-[10px] text-[#52525b] uppercase font-bold">
              Factors
            </span>
            {factors.map((f, i) => (
              <div
                key={i}
                className={`text-[10px] ${
                  f.startsWith("+") ? "text-[#22c55e]" : "text-[#ef4444]"
                }`}
              >
                {f}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs border-t border-[#27272a] pt-2">
          <span className="text-[#a1a1aa]">Outcome Risk</span>
          <span
            className="font-bold"
            style={{
              color:
                riskLevel === "Low"
                  ? "#22c55e"
                  : riskLevel === "Medium"
                    ? "#f59e0b"
                    : "#ef4444",
            }}
          >
            {riskLevel}
          </span>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            className="flex-1 border-[#27272a] text-[#a1a1aa]"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb] text-white"
            onClick={onExecute}
          >
            Execute Campaign
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
