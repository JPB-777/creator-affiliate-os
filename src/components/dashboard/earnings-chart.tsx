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

const COLORS = [
  "#2563eb", "#16a34a", "#ea580c", "#8b5cf6", "#dc2626",
  "#0891b2", "#ca8a04", "#be185d", "#4f46e5", "#059669",
  "#d97706",
];

interface MonthlyEarning {
  period: string;
  network: string;
  total: string;
}

export function EarningsChart({ data }: { data: MonthlyEarning[] }) {
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No earnings data yet. Add earnings to see your revenue chart.
      </p>
    );
  }

  // Get unique networks and periods
  const networks = [...new Set(data.map((d) => d.network))];
  const periods = [...new Set(data.map((d) => d.period))].sort();

  // Pivot data: { period, network1: amount, network2: amount, ... }
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
        <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
        <Legend />
        {networks.map((network, i) => (
          <Bar
            key={network}
            dataKey={network}
            stackId="earnings"
            fill={COLORS[i % COLORS.length]}
            radius={i === networks.length - 1 ? [2, 2, 0, 0] : [0, 0, 0, 0]}
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
