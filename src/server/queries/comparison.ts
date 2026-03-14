import { db } from "@/lib/db";
import { urls, links, earnings, scans } from "@/lib/db/schema";
import { eq, sql, and } from "drizzle-orm";

export type PeriodType = "week" | "month" | "quarter";

interface PeriodMetrics {
  earnings: number;
  urlsAdded: number;
  scansCompleted: number;
  brokenLinksFound: number;
  affiliateLinksDetected: number;
}

export interface ComparisonResult {
  periodA: PeriodMetrics;
  periodB: PeriodMetrics;
  periodALabel: string;
  periodBLabel: string;
}

function getPeriodBounds(period: PeriodType): {
  currentStart: Date;
  currentEnd: Date;
  previousStart: Date;
  previousEnd: Date;
  currentLabel: string;
  previousLabel: string;
} {
  const now = new Date();

  if (period === "week") {
    const dayOfWeek = now.getDay();
    const currentStart = new Date(now);
    currentStart.setDate(now.getDate() - dayOfWeek);
    currentStart.setHours(0, 0, 0, 0);

    const currentEnd = new Date(now);

    const previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - 7);

    const previousEnd = new Date(currentStart);
    previousEnd.setMilliseconds(-1);

    return {
      currentStart,
      currentEnd,
      previousStart,
      previousEnd,
      currentLabel: "This Week",
      previousLabel: "Last Week",
    };
  }

  if (period === "month") {
    const currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentEnd = new Date(now);

    const previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousEnd = new Date(currentStart);
    previousEnd.setMilliseconds(-1);

    return {
      currentStart,
      currentEnd,
      previousStart,
      previousEnd,
      currentLabel: "This Month",
      previousLabel: "Last Month",
    };
  }

  // quarter
  const currentQuarter = Math.floor(now.getMonth() / 3);
  const currentStart = new Date(now.getFullYear(), currentQuarter * 3, 1);
  const currentEnd = new Date(now);

  const prevQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
  const prevYear = currentQuarter === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const previousStart = new Date(prevYear, prevQuarter * 3, 1);
  const previousEnd = new Date(currentStart);
  previousEnd.setMilliseconds(-1);

  return {
    currentStart,
    currentEnd,
    previousStart,
    previousEnd,
    currentLabel: `Q${currentQuarter + 1} ${now.getFullYear()}`,
    previousLabel: `Q${prevQuarter + 1} ${prevYear}`,
  };
}

export async function getPeriodComparison(
  userId: string,
  period: PeriodType
): Promise<ComparisonResult> {
  const bounds = getPeriodBounds(period);

  // Single query with conditional aggregates for all metrics
  const result = await db.execute(
    sql`SELECT
      -- Earnings (using period column YYYY-MM matching)
      coalesce((
        SELECT sum(amount::numeric)
        FROM ${earnings}
        WHERE ${earnings.userId} = ${userId}
          AND ${earnings.createdAt} >= ${bounds.currentStart}
          AND ${earnings.createdAt} <= ${bounds.currentEnd}
      ), 0) as current_earnings,
      coalesce((
        SELECT sum(amount::numeric)
        FROM ${earnings}
        WHERE ${earnings.userId} = ${userId}
          AND ${earnings.createdAt} >= ${bounds.previousStart}
          AND ${earnings.createdAt} <= ${bounds.previousEnd}
      ), 0) as previous_earnings,

      -- URLs added
      (SELECT count(*) FROM ${urls}
        WHERE ${urls.userId} = ${userId}
          AND ${urls.createdAt} >= ${bounds.currentStart}
          AND ${urls.createdAt} <= ${bounds.currentEnd}
      )::int as current_urls,
      (SELECT count(*) FROM ${urls}
        WHERE ${urls.userId} = ${userId}
          AND ${urls.createdAt} >= ${bounds.previousStart}
          AND ${urls.createdAt} <= ${bounds.previousEnd}
      )::int as previous_urls,

      -- Scans completed
      (SELECT count(*) FROM ${scans}
        WHERE ${scans.userId} = ${userId}
          AND ${scans.status} = 'completed'
          AND ${scans.completedAt} >= ${bounds.currentStart}
          AND ${scans.completedAt} <= ${bounds.currentEnd}
      )::int as current_scans,
      (SELECT count(*) FROM ${scans}
        WHERE ${scans.userId} = ${userId}
          AND ${scans.status} = 'completed'
          AND ${scans.completedAt} >= ${bounds.previousStart}
          AND ${scans.completedAt} <= ${bounds.previousEnd}
      )::int as previous_scans,

      -- Broken links found
      (SELECT count(*) FROM ${links}
        WHERE ${links.userId} = ${userId}
          AND ${links.status} = 'broken'
          AND ${links.createdAt} >= ${bounds.currentStart}
          AND ${links.createdAt} <= ${bounds.currentEnd}
      )::int as current_broken,
      (SELECT count(*) FROM ${links}
        WHERE ${links.userId} = ${userId}
          AND ${links.status} = 'broken'
          AND ${links.createdAt} >= ${bounds.previousStart}
          AND ${links.createdAt} <= ${bounds.previousEnd}
      )::int as previous_broken,

      -- Affiliate links detected
      (SELECT count(*) FROM ${links}
        WHERE ${links.userId} = ${userId}
          AND ${links.isAffiliate} = true
          AND ${links.createdAt} >= ${bounds.currentStart}
          AND ${links.createdAt} <= ${bounds.currentEnd}
      )::int as current_affiliate,
      (SELECT count(*) FROM ${links}
        WHERE ${links.userId} = ${userId}
          AND ${links.isAffiliate} = true
          AND ${links.createdAt} >= ${bounds.previousStart}
          AND ${links.createdAt} <= ${bounds.previousEnd}
      )::int as previous_affiliate`
  );

  const row = result.rows[0] as Record<string, string>;

  return {
    periodA: {
      earnings: parseFloat(row.current_earnings) || 0,
      urlsAdded: parseInt(row.current_urls) || 0,
      scansCompleted: parseInt(row.current_scans) || 0,
      brokenLinksFound: parseInt(row.current_broken) || 0,
      affiliateLinksDetected: parseInt(row.current_affiliate) || 0,
    },
    periodB: {
      earnings: parseFloat(row.previous_earnings) || 0,
      urlsAdded: parseInt(row.previous_urls) || 0,
      scansCompleted: parseInt(row.previous_scans) || 0,
      brokenLinksFound: parseInt(row.previous_broken) || 0,
      affiliateLinksDetected: parseInt(row.previous_affiliate) || 0,
    },
    periodALabel: bounds.currentLabel,
    periodBLabel: bounds.previousLabel,
  };
}
