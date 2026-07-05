"use client";

import React from "react";
import { CircleCheck, Clock, Flame, ShieldAlert, Award } from "lucide-react";
import { eventCategoryIcons, severityIcons } from "@/lib/icons";
import { ImpactChip } from "./impact-chip";

interface Choice {
  text: string;
  description: string;
  category: "GROWTH" | "PRODUCT" | "FINANCE" | "INFRA" | "SECURITY" | "FUNDING";
  cost: string;
  risk: "Low" | "Medium" | "High";
  potential: string;
  effects: Record<string, number>;
}

interface GameEvent {
  id: string;
  category: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  choices: Array<{
    text: string;
    description?: string;
    effects: Record<string, number>;
  }>;
  delayPenalty?: {
    intervalMs: number;
    effects: Record<string, number>;
  };
}

interface CurrentEventPanelProps {
  currentEvent: GameEvent | null;
  countdown: number;
  onChooseChoice: (choice: Choice | { text: string; effects: Record<string, number> }) => void;
  onHoverChoice: (effects: Record<string, number> | null) => void;
  stats: {
    day: number;
    hype: number;
    performance: number;
    techDebt: number;
    bugs: number;
    money: number;
  };
  playClick: () => void;
  launchDayResolved: boolean;
  onResolveLaunchDay: (effects: Record<string, number>) => void;
}

export function CurrentEventPanel({
  currentEvent,
  countdown,
  onChooseChoice,
  onHoverChoice,
  stats,
  playClick,
  launchDayResolved,
  onResolveLaunchDay,
}: CurrentEventPanelProps) {

  // Custom available actions based on current day
  const getAvailableActions = (): Choice[] => {
    if (stats.day <= 5) {
      return [
        {
          text: "Prepare Growth Campaign",
          description: "Set up a small acquisition test. Results depend on product stability and reputation.",
          category: "GROWTH",
          cost: "$500",
          risk: "Low",
          potential: "+Users, +Hype",
          effects: { money: -500, hype: 15, users: 100, performance: -5 },
        },
        {
          text: "Improve Product Uptime",
          description: "Fix reliability issues before more users arrive.",
          category: "PRODUCT",
          cost: "$200",
          risk: "Low",
          potential: "+Stability",
          effects: { money: -200, performance: 10, techDebt: -5 },
        },
        {
          text: "Optimize Infra Costs",
          description: "Reduce operating costs, but risk adding technical debt.",
          category: "FINANCE",
          cost: "$0",
          risk: "Medium",
          potential: "-Expenses, +Debt",
          effects: { money: 0, techDebt: 5, performance: -5 },
        },
      ];
    } else if (stats.day <= 15) {
      return [
        {
          text: "Run Paid Acquisition Campaign",
          description: "Scale target growth variables using search and social ads.",
          category: "GROWTH",
          cost: "$1,000",
          risk: "Medium",
          potential: "++Users, ++Hype",
          effects: { money: -1000, hype: 30, users: 350, performance: -10 },
        },
        {
          text: "Refactor Database Indexing",
          description: "Speed up response cycles and optimize core DB infrastructure.",
          category: "INFRA",
          cost: "$500",
          risk: "Low",
          potential: "++Stability",
          effects: { money: -500, performance: 25, techDebt: -15 },
        },
        {
          text: "Outsource Bug Fixing",
          description: "Hire a contract engineer to clear accumulated backlogs.",
          category: "PRODUCT",
          cost: "$800",
          risk: "Low",
          potential: "-Bugs, +Stability",
          effects: { money: -800, techDebt: -20, performance: 10 },
        },
      ];
    } else {
      return [
        {
          text: "Viral Brand Campaign",
          description: "Launch an aggressive publicity loop for organic acquisition.",
          category: "GROWTH",
          cost: "$2,500",
          risk: "High",
          potential: "+++Users, +++Hype",
          effects: { money: -2500, hype: 50, users: 1500, performance: -15 },
        },
        {
          text: "Conduct Security Audit",
          description: "Scan operations vulnerabilities to build brand equity.",
          category: "SECURITY",
          cost: "$1,200",
          risk: "Low",
          potential: "+Reputation, +Stability",
          effects: { money: -1200, reputation: 20, performance: 15, techDebt: -10 },
        },
        {
          text: "Optimize Subscription Funnel",
          description: "A/B test pricing pages to convert active sub-accounts.",
          category: "FUNDING",
          cost: "$0",
          risk: "Medium",
          potential: "+Conversion, -Users",
          effects: { money: 0, users: -200 },
        },
      ];
    }
  };

  const availableActions = getAvailableActions();

  // Category Accent Colors mapping
  const CATEGORY_COLORS: Record<string, string> = {
    GROWTH: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    PRODUCT: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    FINANCE: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    INFRA: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    SECURITY: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    FUNDING: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  };

  // Launch Day Initial Selection Screen
  if (stats.day === 1 && !launchDayResolved) {
    const launchDayChoices: Array<{
      text: string;
      description: string;
      category: "GROWTH" | "PRODUCT" | "FUNDING";
      cost: string;
      risk: "Low" | "Medium";
      potential: string;
      effects: Record<string, number>;
    }> = [
      {
        text: "Focus on Growth",
        description: "Scale early adopters and build social presence.",
        category: "GROWTH" as const,
        cost: "$0",
        risk: "Low" as const,
        potential: "+Users, +Hype",
        effects: { hype: 20, users: 150, performance: -10 },
      },
      {
        text: "Focus on Product",
        description: "Improve reliability and resolve technical debt.",
        category: "PRODUCT" as const,
        cost: "$0",
        risk: "Low" as const,
        potential: "+Stability",
        effects: { performance: 15, techDebt: -8, hype: -10 },
      },
      {
        text: "Focus on Revenue",
        description: "A/B test subscription pages to optimize pricing.",
        category: "FUNDING" as const,
        cost: "$0",
        risk: "Medium" as const,
        potential: "+Conversion, +Cash",
        effects: { money: 500, hype: -10 },
      },
    ];

    return (
      <div className="bg-[#121217] border border-[#1f1f29] rounded flex flex-col min-h-0 flex-1 overflow-hidden select-none p-4 space-y-4">
        <div className="border border-[#10b981]/30 bg-emerald-500/5 p-4 rounded-md space-y-2 text-left shadow-sm">
          <div className="flex items-center gap-1.5 text-[#10b981] font-bold uppercase text-[9px] tracking-wider font-mono">
            <Flame className="size-4" />
            Launch Day Goal
          </div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Launch Day
          </h2>
          <p className="text-[10px] text-slate-300 leading-relaxed font-mono">
            Your MVP is online with 100 early users. You have limited cash and 30 days to reach 1,000,000 users. Choose your initial strategy focus.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5 xl:grid-cols-3">
          {launchDayChoices.map((choice, i) => (
            <button
              key={i}
              onClick={() => {
                playClick();
                onResolveLaunchDay(choice.effects);
              }}
              onMouseEnter={() => onHoverChoice(choice.effects)}
              onMouseLeave={() => onHoverChoice(null)}
              className="bg-[#0b0b0f] hover:bg-[#1a1a24] border border-[#1f1f29] hover:border-[#10b981]/80 p-3 rounded text-left transition-all cursor-pointer min-h-[140px] flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${CATEGORY_COLORS[choice.category]}`}>
                    {choice.category}
                  </span>
                  <span className="text-slate-500 text-[8px] font-mono">Cost: {choice.cost}</span>
                </div>
                <span className="block text-[10px] font-bold text-white uppercase tracking-wide">
                  {choice.text}
                </span>
                <p className="text-[9px] text-slate-500 leading-relaxed">
                  {choice.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(choice.effects).map(([metric, val]) => (
                  <ImpactChip key={metric} metric={metric} value={val} />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const SeverityIcon = currentEvent ? severityIcons[currentEvent.severity] : null;
  const CategoryIcon = currentEvent
    ? (eventCategoryIcons[currentEvent.category.toLowerCase() as keyof typeof eventCategoryIcons] || eventCategoryIcons.infra)
    : null;

  // Determine situation status title and description
  const situationTitle = currentEvent ? currentEvent.title : "Stable Start";
  const situationDesc = currentEvent 
    ? currentEvent.description 
    : "Your SaaS is online. Growth is starting, but stability is weakening. Keep an eye on operating overheads.";

  // Dynamic context tips based on telemetry
  const getRecommendedFocus = () => {
    if (currentEvent) return "Address the active priority incident immediately.";
    if (stats.performance < 60) return "Product reliability: Perform Uptime or Index refactoring.";
    if (stats.money < 1000) return "Control burn rate: Optimize operating variables.";
    return "Prepare acquisition campaign to scale users.";
  };

  return (
    <div className="bg-[#121217] border border-[#1f1f29] rounded flex flex-col min-h-0 flex-1 overflow-hidden select-none">
      
      {/* Header Panel Title */}
      <div className="px-4 py-2 bg-[#0b0b0f] border-b border-[#1f1f29] flex items-center justify-between shrink-0">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Current Situation
        </span>
        <span className="text-[9px] text-[#10b981] font-bold font-mono">Cockpit</span>
      </div>

      {/* Main Workspace content */}
      <div className="flex-grow p-3.5 flex flex-col gap-3.5 min-h-0 overflow-y-auto scroller">
        
        {/* CURRENT SITUATION DETAILS */}
        <div className="border border-[#1f1f29] bg-[#0b0b0f] p-3 rounded-md space-y-2 shrink-0 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center text-[9px] font-bold">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 uppercase tracking-wider">
              {CategoryIcon && <CategoryIcon className="size-3" />}
              {currentEvent ? currentEvent.category : "OPERATIONS"}
            </span>
            {currentEvent?.delayPenalty ? (
              <span className="flex items-center gap-1 text-[#f43f5e] animate-pulse">
                <Clock className="size-3.5" />
                Decide: {countdown.toFixed(1)}s
              </span>
            ) : (
              <span className="text-emerald-400 font-mono text-[9px]">Normal Status</span>
            )}
          </div>
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              {situationTitle}
            </h2>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              {situationDesc}
            </p>
          </div>

          {/* Recommended Focus Area */}
          <div className="mt-2.5 pt-2 border-t border-[#1f1f29]/30 flex items-center gap-2 text-[9px] text-slate-300">
            <Award className="size-4 text-[#10b981] shrink-0" />
            <span className="font-bold text-white">Recommended Focus:</span>
            <span>{getRecommendedFocus()}</span>
          </div>
        </div>

        {/* DECISION / AVAILABLE ACTIONS CARD ROW */}
        <div className="flex-grow flex flex-col min-h-[160px] max-h-[220px]">
          <div className="pb-1.5 border-b border-[#1f1f29] flex justify-between items-center shrink-0 mb-2">
            <span className="text-white font-bold uppercase tracking-wider text-[10px]">
              Available Actions
            </span>
            <span className="text-slate-500 text-[8px] font-bold uppercase font-mono">Tactics</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 xl:grid-cols-3 flex-grow min-h-0">
            {currentEvent ? (
              currentEvent.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => {
                    playClick();
                    onChooseChoice(choice);
                  }}
                  onMouseEnter={() => onHoverChoice(choice.effects)}
                  onMouseLeave={() => onHoverChoice(null)}
                  className="bg-[#0b0b0f] hover:bg-[#1a1a24] border border-[#1f1f29] hover:border-[#10b981]/80 p-3 rounded text-left transition-all cursor-pointer flex flex-col justify-between shadow-sm min-h-[120px]"
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase text-purple-400 bg-purple-500/10 border border-purple-500/20">
                        EVENT CHOICE
                      </span>
                    </div>
                    <span className="block text-[10px] font-bold text-white uppercase tracking-wide truncate">
                      {choice.text}
                    </span>
                    <p className="text-[9px] text-slate-500 line-clamp-2 leading-relaxed">
                      {choice.description || "Deploy operations to resolve active incident variables."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(choice.effects).map(([metric, val]) => (
                      <ImpactChip key={metric} metric={metric} value={val} />
                    ))}
                  </div>
                </button>
              ))
            ) : (
              availableActions.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => {
                    playClick();
                    onChooseChoice(choice);
                  }}
                  onMouseEnter={() => onHoverChoice(choice.effects)}
                  onMouseLeave={() => onHoverChoice(null)}
                  className="bg-[#0b0b0f] hover:bg-[#1a1a24] border border-[#1f1f29] hover:border-[#10b981]/80 p-3 rounded text-left transition-all cursor-pointer flex flex-col justify-between shadow-sm min-h-[120px]"
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${CATEGORY_COLORS[choice.category]}`}>
                        {choice.category}
                      </span>
                      <span className="text-slate-500 text-[8px] font-mono">Cost: {choice.cost}</span>
                    </div>
                    <span className="block text-[10px] font-bold text-white uppercase tracking-wide truncate">
                      {choice.text}
                    </span>
                    <p className="text-[9px] text-slate-500 line-clamp-2 leading-relaxed">
                      {choice.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(choice.effects).map(([metric, val]) => (
                      <ImpactChip key={metric} metric={metric} value={val} />
                    ))}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
