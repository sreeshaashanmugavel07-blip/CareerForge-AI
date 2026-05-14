"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { DimensionScores } from "@/types";

const LABELS: Record<keyof DimensionScores, string> = {
  technical: "Technical",
  resume: "Resume",
  communication: "Communication",
  portfolio: "Portfolio",
  confidence: "Confidence",
  projects: "Projects",
};

/** Radar chart for six readiness dimensions (Recharts). */
export function ReadinessRadar({ data }: { data: DimensionScores }) {
  const chartData = (Object.keys(data) as (keyof DimensionScores)[]).map((k) => ({
    subject: LABELS[k],
    A: data[k],
    fullMark: 100,
  }));

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="You"
            dataKey="A"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.35}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
