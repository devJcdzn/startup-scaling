"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EconomyItem {
  label: string;
  value: string;
  color?: string;
}

interface EconomyCardProps {
  title: string;
  icon: string;
  items: EconomyItem[];
  accentColor: string;
}

export function EconomyCard({ title, icon, items, accentColor }: EconomyCardProps) {
  return (
    <Card className="bg-[#18181b] border-[#27272a]">
      <CardHeader className="pb-2">
        <CardTitle
          className="text-sm font-medium flex items-center gap-2"
          style={{ color: accentColor }}
        >
          <span>{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-xs text-[#a1a1aa]">{item.label}</span>
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: item.color ?? "#fafafa" }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
