"use client";

import React from "react";
import { CircleCheck, Clock } from "lucide-react";
import { eventCategoryIcons, severityIcons } from "@/lib/icons";
import { ImpactChip } from "./impact-chip";

interface Choice {
  text: string;
  effects: Record<string, number>;
}

interface GameEvent {
  id: string;
  category: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  choices: Choice[];
  delayPenalty?: {
    intervalMs: number;
    effects: Record<string, number>;
  };
}

interface CurrentEventPanelProps {
  currentEvent: GameEvent | null;
  countdown: number;
  onChoose: (index: number) => void;
  onHoverChoice: (index: number | null) => void;
  activeTab: "growth" | "product" | "funding";
  setActiveTab: (tab: "growth" | "product" | "funding") => void;
  stats: {
    hype: number;
    conversionRate: number;
    performance: number;
    techDebt: number;
    bugs: number;
    difficulty: number;
    money: number;
  };
  changeTheme: (theme: "emerald" | "amber" | "cyan") => void;
  activeTheme: "emerald" | "amber" | "cyan";
  playClick: () => void;
}

export function CurrentEventPanel({
  currentEvent,
  countdown,
  onChoose,
  onHoverChoice,
  activeTab,
  setActiveTab,
  stats,
  changeTheme,
  activeTheme,
  playClick,
}: CurrentEventPanelProps) {
  const SeverityIcon = currentEvent ? severityIcons[currentEvent.severity] : null;
  const CategoryIcon = currentEvent
    ? (eventCategoryIcons[currentEvent.category.toLowerCase() as keyof typeof eventCategoryIcons] || eventCategoryIcons.infra)
    : null;

  return (
    <div className="bg-[#121217] border border-[#1f1f29] rounded flex flex-col min-h-0 overflow-hidden select-none">
      {/* Contextual Tabs */}
      <div className="flex border-b border-[#1f1f29] bg-[#0b0b0f] text-[10px] font-bold select-none shrink-0">
        <button
          onClick={() => {
            playClick();
            setActiveTab("growth");
          }}
          className={`px-4 py-2.5 border-r border-[#1f1f29] cursor-pointer flex items-center gap-1.5 transition-all ${
            activeTab === "growth"
              ? "bg-[#121217] text-[#10b981] border-b-2 border-b-[#10b981]"
              : "text-slate-400 hover:bg-[#1a1a24]/40"
          }`}
        >
          Growth & Marketing
        </button>

        <button
          onClick={() => {
            playClick();
            setActiveTab("product");
          }}
          className={`px-4 py-2.5 border-r border-[#1f1f29] cursor-pointer flex items-center gap-1.5 transition-all ${
            activeTab === "product"
              ? "bg-[#121217] text-[#10b981] border-b-2 border-b-[#10b981]"
              : "text-slate-400 hover:bg-[#1a1a24]/40"
          }`}
        >
          Product & Engineering
        </button>

        <button
          onClick={() => {
            playClick();
            setActiveTab("funding");
          }}
          className={`px-4 py-2.5 border-r border-[#1f1f29] cursor-pointer flex items-center gap-1.5 transition-all ${
            activeTab === "funding"
              ? "bg-[#121217] text-[#10b981] border-b-2 border-b-[#10b981]"
              : "text-slate-400 hover:bg-[#1a1a24]/40"
          }`}
        >
          Funding & HR
        </button>
      </div>

      {/* Main Workspace content */}
      <div className="flex-1 p-3 flex flex-col gap-3 min-h-0 overflow-y-auto scroller">
        {/* ACTIVE DECISION CARD */}
        {currentEvent ? (
          <div className="border border-[#f43f5e]/30 bg-[#f43f5e]/5 p-3 rounded shrink-0 space-y-2">
            <div className="flex justify-between items-center text-[9px] font-bold">
              <span className="flex items-center gap-1 text-[#f43f5e] uppercase tracking-wider">
                {SeverityIcon && <SeverityIcon className="size-3.5" />}
                {currentEvent.severity} Priority
              </span>
              <span className="flex items-center gap-1 text-slate-400 uppercase tracking-wider">
                {CategoryIcon && <CategoryIcon className="size-3.5" />}
                {currentEvent.category}
              </span>
              {currentEvent.delayPenalty && (
                <span className="flex items-center gap-1 text-[#f43f5e] animate-pulse">
                  <Clock className="size-3.5" />
                  Decide: {countdown.toFixed(1)}s
                </span>
              )}
            </div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider truncate">
              {currentEvent.title}
            </h2>
            <p className="text-[10px] text-slate-300 leading-relaxed line-clamp-3">
              {currentEvent.description}
            </p>

            {/* Decisions Cards Grid */}
            <div className="grid grid-cols-1 gap-2 xl:grid-cols-3 pt-1">
              {currentEvent.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => {
                    playClick();
                    onChoose(i);
                  }}
                  onMouseEnter={() => onHoverChoice(i)}
                  onMouseLeave={() => onHoverChoice(null)}
                  className="bg-[#1a1a24] hover:bg-[#222230] border border-[#1f1f29] hover:border-[#10b981] p-2.5 rounded text-left transition-all cursor-pointer min-h-[90px] xl:min-h-[110px] flex flex-col justify-between"
                >
                  <div>
                    <span className="block text-[10px] font-bold text-white mb-1 uppercase tracking-wide truncate">
                      {choice.text}
                    </span>
                    <p className="text-[9px] text-slate-400 line-clamp-2 leading-snug">
                      Resolve event options with targeted trade-offs.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {Object.entries(choice.effects).map(([metric, val]) => (
                      <ImpactChip key={metric} metric={metric} value={val} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* EMPTY EVENT STATE */
          <div className="border border-[#1f1f29] bg-[#121217]/50 p-4 rounded shrink-0 flex items-center justify-between select-none">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shrink-0">
                <CircleCheck className="size-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  No active incident
                </h3>
                <p className="text-[9px] text-slate-400 mt-0.5">
                  Your startup is running normally. Keep an eye on growth, cashflow and product health.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DEPARTMENT CHECKS & SETTINGS */}
        <div className="flex-1 border border-[#1f1f29] bg-[#0b0b0f] p-3 rounded text-[11px] flex flex-col justify-center min-h-[140px]">
          {activeTab === "growth" && (
            <div className="space-y-2 h-full flex flex-col justify-between">
              <div>
                <span className="text-white font-bold block uppercase tracking-wider border-b border-[#1f1f29] pb-1 mb-2">
                  Growth Operations
                </span>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                  Acquisition campaigns, conversions, and viral marketing pipelines. High brand hype accelerates organic acquisition loops.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-400 border-t border-[#1f1f29]/30 pt-2 shrink-0">
                <div className="flex justify-between">
                  <span>Hype Factor:</span>
                  <span className="text-white font-bold">{stats.hype}%</span>
                </div>
                <div className="flex justify-between">
                  <span>CAC Rate:</span>
                  <span className="text-white font-bold">
                    ${Math.max(4, 25 - stats.hype * 0.2).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Conversion Rate:</span>
                  <span className="text-white font-bold">
                    {(stats.conversionRate * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Difficulty Modifier:</span>
                  <span className="text-white font-bold">{stats.difficulty.toFixed(2)}x</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "product" && (
            <div className="space-y-2 h-full flex flex-col justify-between">
              <div>
                <span className="text-white font-bold block uppercase tracking-wider border-b border-[#1f1f29] pb-1 mb-2">
                  Stability & Debt Control
                </span>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                  Technical debt and bug backlogs degrade Platform Stability, increasing infrastructure overhead and user churn risks.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-400 border-t border-[#1f1f29]/30 pt-2 shrink-0">
                <div className="flex justify-between">
                  <span>Active Bugs:</span>
                  <span className="text-white font-bold">{stats.bugs}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stability Index:</span>
                  <span className="text-white font-bold">{stats.performance}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Tech Debt Rate:</span>
                  <span className="text-white font-bold">{stats.techDebt}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Risk Status:</span>
                  <span className={`font-bold ${stats.techDebt > 50 ? "text-[#f43f5e]" : "text-emerald-400"}`}>
                    {stats.techDebt > 50 ? "HIGH RISK" : "STABLE"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "funding" && (
            <div className="space-y-2 h-full flex flex-col justify-between">
              <div>
                <span className="text-white font-bold block uppercase tracking-wider border-b border-[#1f1f29] pb-1 mb-2">
                  Financial Strategy
                </span>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                  Raise brand equity or manage operational variables. Switch styling profiles to optimize visibility.
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-[#1f1f29]/30 pt-2 shrink-0">
                <span className="text-slate-400 text-[10px]">Brand Colorways:</span>
                <div className="flex gap-2">
                  {["emerald", "amber", "cyan"].map((t) => (
                    <button
                      key={t}
                      onClick={() => changeTheme(t as any)}
                      className={`px-2 py-0.5 border rounded text-[9px] cursor-pointer font-bold uppercase transition-all ${
                        activeTheme === t
                          ? "bg-[#10b981] text-[#0b0b0f] border-[#10b981]"
                          : "border-[#1f1f29] hover:border-slate-500 text-slate-300"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
