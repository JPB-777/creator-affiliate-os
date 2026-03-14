"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DollarSign } from "lucide-react";

const COLORS = [
  "oklch(0.55 0.25 270)",  // indigo
  "oklch(0.6 0.2 195)",   // teal
  "oklch(0.65 0.18 145)", // emerald
  "oklch(0.6 0.22 310)",  // violet
  "oklch(0.7 0.15 85)",   // amber
  "oklch(0.55 0.2 30)",   // orange
  "oklch(0.6 0.18 350)",  // rose
  "oklch(0.55 0.22 250)", // blue
  "oklch(0.65 0.15 170)", // green
  "oklch(0.6 0.2 290)",   // purple
  "oklch(0.7 0.18 60)",   // yellow
];

interface MonthlyEarning {
  period: string;
  network: string;
  total: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; fill: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.fill }} />
          <span>{entry.name}:</span>
          <span className="font-mono font-medium text-foreground">${entry.value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

export function EarningsChart({ data }: { data: MonthlyEarning[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <DollarSign className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm font-medium">No earnings data yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Add earnings to see your revenue chart.</p>
      </div>
    );
  }

  const networks = [...new Set(data.map((d) => d.network))];
  const periods = [...new Set(data.map((d) => d.period))].sort();

  const chartData = periods.map((period) => {
    const row: Record<string, string | number> = {
      period: formatPeriod(period),
    };
    for (const network of networks) {
      const entry = data.find((d) => d.period === period && d.network === network);
      row[network] = entry ? parseFloat(entry.total) : 0;
    }
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="period" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "oklch(0.5 0 0 / 5%)" }} />
        <Legend />
        {networks.map((network, i) => (
          <Bar
            key={network}
            dataKey={network}
            stackId="earnings"
            fill={COLORS[i % COLORS.length]}
            radius={i === networks.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

function formatPeriod(period: string): string {
  const [year, month] = period.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(month) - 1]} ${year.slice(2)}`;
}
