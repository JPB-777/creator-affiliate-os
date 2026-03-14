"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  DollarSign,
  Globe,
  ScanLine,
  AlertTriangle,
  Link2,
} from "lucide-react";
import type { ComparisonResult, PeriodType } from "@/server/queries/comparison";

interface PeriodComparisonProps {
  initialData: ComparisonResult;
  fetchComparison: (period: PeriodType) => Promise<ComparisonResult>;
}

function ChangeIndicator({ current, previous }: { current: number; previous: number }) {
  if (previous === 0 && current === 0) {
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  }

  if (previous === 0) {
    return (
      <span className="flex items-center gap-0.5 text-xs font-medium text-success">
        <ArrowUpRight className="h-3.5 w-3.5" />
        New
      </span>
    );
  }

  const pct = ((current - previous) / previous) * 100;
  const isUp = pct > 0;
  const isFlat = Math.abs(pct) < 0.5;

  if (isFlat) {
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  }

  return (
    <span
      className={`flex items-center gap-0.5 text-xs font-medium ${
        isUp ? "text-success" : "text-destructive"
      }`}
    >
      {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
      {Math.abs(pct).toFixed(0)}%
    </span>
  );
}

function MetricCard({
  label,
  current,
  previous,
  icon,
  format,
}: {
  label: string;
  current: number;
  previous: number;
  icon: React.ReactNode;
  format?: "currency" | "number";
}) {
  const formatted = format === "currency" ? `$${current.toFixed(2)}` : current.toString();

  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-muted p-2 text-muted-foreground">{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-lg font-bold font-mono tabular-nums">{formatted}</p>
        </div>
      </div>
      <ChangeIndicator current={current} previous={previous} />
    </div>
  );
}

export function PeriodComparison({ initialData, fetchComparison }: PeriodComparisonProps) {
  const [period, setPeriod] = useState<PeriodType>("month");
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  function handlePeriodChange(value: string | null) {
    if (!value) return;
    const newPeriod = value as PeriodType;
    setPeriod(newPeriod);
    startTransition(async () => {
      const result = await fetchComparison(newPeriod);
      setData(result);
    });
  }

  return (
    <Card className={isPending ? "opacity-60 transition-opacity" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Period Comparison</CardTitle>
        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="quarter">Quarter</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">
          {data.periodALabel} vs {data.periodBLabel}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <MetricCard
            label="Earnings"
            current={data.periodA.earnings}
            previous={data.periodB.earnings}
            icon={<DollarSign className="h-4 w-4" />}
            format="currency"
          />
          <MetricCard
            label="URLs Added"
            current={data.periodA.urlsAdded}
            previous={data.periodB.urlsAdded}
            icon={<Globe className="h-4 w-4" />}
          />
          <MetricCard
            label="Scans"
            current={data.periodA.scansCompleted}
            previous={data.periodB.scansCompleted}
            icon={<ScanLine className="h-4 w-4" />}
          />
          <MetricCard
            label="Broken Links"
            current={data.periodA.brokenLinksFound}
            previous={data.periodB.brokenLinksFound}
            icon={<AlertTriangle className="h-4 w-4" />}
          />
          <MetricCard
            label="Affiliate Links"
            current={data.periodA.affiliateLinksDetected}
            previous={data.periodB.affiliateLinksDetected}
            icon={<Link2 className="h-4 w-4" />}
          />
        </div>
      </CardContent>
    </Card>
  );
}
