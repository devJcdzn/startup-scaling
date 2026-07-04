"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  icon: string;
  accentColor: string;
  children: React.ReactNode;
}

export function MetricCard({ title, icon, accentColor, children }: MetricCardProps) {
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
      <CardContent className="space-y-1.5">{children}</CardContent>
    </Card>
  );
}
