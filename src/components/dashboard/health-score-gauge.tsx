"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HealthScoreGaugeProps {
  overall: number;
  grade: string;
  breakdown: {
    linkHealth: number;
    coverage: number;
    freshness: number;
    earningsGrowth: number;
  };
}

const gradeColors: Record<string, string> = {
  A: "text-success",
  B: "text-primary",
  C: "text-warning",
  D: "text-orange-500",
  F: "text-destructive",
};

const gradeStroke: Record<string, string> = {
  A: "stroke-success",
  B: "stroke-primary",
  C: "stroke-warning",
  D: "stroke-orange-500",
  F: "stroke-destructive",
};

export function HealthScoreGauge({ overall, grade, breakdown }: HealthScoreGaugeProps) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (overall / 100) * circumference;

  const breakdownItems = [
    { label: "Link Health", value: breakdown.linkHealth, weight: "40%" },
    { label: "Freshness", value: breakdown.freshness, weight: "25%" },
    { label: "Coverage", value: breakdown.coverage, weight: "20%" },
    { label: "Earnings Growth", value: breakdown.earningsGrowth, weight: "15%" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl bg-card ring-1 ring-foreground/10 p-6">
      {/* SVG Ring */}
      <div className="relative h-32 w-32 shrink-0">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            className="stroke-muted"
            strokeWidth="10"
          />
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            className={gradeStroke[grade] || "stroke-primary"}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn("text-3xl font-bold font-mono", gradeColors[grade])}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {grade}
          </motion.span>
          <span className="text-xs text-muted-foreground font-mono">{overall}%</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="flex-1 space-y-2 w-full">
        <h3 className="text-sm font-semibold">Health Score</h3>
        {breakdownItems.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {item.label} <span className="opacity-50">({item.weight})</span>
              </span>
              <span className="font-mono tabular-nums">{item.value}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
