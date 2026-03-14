"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HistoryPoint {
  day: string;
  healthy: number;
  broken: number;
  redirect: number;
  timeout: number;
}

export function LinkHistoryChart({ data }: { data: HistoryPoint[] }) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No history data yet. History builds up over time as links are scanned.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="day"
          tickFormatter={(v: string) => v.slice(5)}
          className="text-xs"
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
        />
        <Tooltip
          contentStyle={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Area
          type="monotone"
          dataKey="healthy"
          stackId="1"
          stroke="oklch(0.65 0.15 145)"
          fill="oklch(0.65 0.15 145 / 0.3)"
          name="Healthy"
        />
        <Area
          type="monotone"
          dataKey="redirect"
          stackId="1"
          stroke="oklch(0.75 0.15 75)"
          fill="oklch(0.75 0.15 75 / 0.3)"
          name="Redirect"
        />
        <Area
          type="monotone"
          dataKey="broken"
          stackId="1"
          stroke="oklch(0.55 0.2 25)"
          fill="oklch(0.55 0.2 25 / 0.3)"
          name="Broken"
        />
        <Area
          type="monotone"
          dataKey="timeout"
          stackId="1"
          stroke="oklch(0.6 0.1 250)"
          fill="oklch(0.6 0.1 250 / 0.3)"
          name="Timeout"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
