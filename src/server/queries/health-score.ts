import { db } from "@/lib/db";
import { urls, links, earnings } from "@/lib/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";

type Grade = "A" | "B" | "C" | "D" | "F";

interface HealthScore {
  overall: number;
  grade: Grade;
  breakdown: {
    linkHealth: number;
    coverage: number;
    freshness: number;
    earningsGrowth: number;
  };
}

function getGrade(score: number): Grade {
  if (score >= 80) return "A";
  if (score >= 65) return "B";
  if (score >= 50) return "C";
  if (score >= 35) return "D";
  return "F";
}

export async function getHealthScore(userId: string): Promise<HealthScore> {
  // Get total URLs
  const [urlStats] = await db
    .select({
      total: sql<number>`count(*)`,
      scannedRecent: sql<number>`count(*) filter (where ${urls.lastScannedAt} >= now() - interval '7 days')`,
    })
    .from(urls)
    .where(eq(urls.userId, userId));

  const totalUrls = Number(urlStats?.total ?? 0);
  const recentlyScanned = Number(urlStats?.scannedRecent ?? 0);

  if (totalUrls === 0) {
    return {
      overall: 0,
      grade: "F",
      breakdown: { linkHealth: 0, coverage: 0, freshness: 0, earningsGrowth: 0 },
    };
  }

  // Link health: (total affiliate - broken) / total affiliate
  const [linkStats] = await db
    .select({
      total: sql<number>`count(*)`,
      broken: sql<number>`count(*) filter (where ${links.status} = 'broken')`,
    })
    .from(links)
    .where(and(eq(links.userId, userId), eq(links.isAffiliate, true)));

  const totalLinks = Number(linkStats?.total ?? 0);
  const brokenLinks = Number(linkStats?.broken ?? 0);
  const linkHealth = totalLinks > 0 ? ((totalLinks - brokenLinks) / totalLinks) * 100 : 100;

  // Coverage: URLs with at least 1 affiliate link / total URLs
  const [coverageStats] = await db
    .select({
      withLinks: sql<number>`count(distinct ${links.urlId})`,
    })
    .from(links)
    .where(and(eq(links.userId, userId), eq(links.isAffiliate, true)));

  const urlsWithLinks = Number(coverageStats?.withLinks ?? 0);
  const coverage = (urlsWithLinks / totalUrls) * 100;

  // Freshness: URLs scanned in last 7 days / total
  const freshness = (recentlyScanned / totalUrls) * 100;

  // Earnings growth: this month vs last month
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [thisMonthEarnings] = await db
    .select({ total: sql<number>`coalesce(sum(${earnings.amount}::numeric), 0)` })
    .from(earnings)
    .where(and(eq(earnings.userId, userId), gte(earnings.createdAt, thisMonthStart)));

  const [lastMonthEarnings] = await db
    .select({ total: sql<number>`coalesce(sum(${earnings.amount}::numeric), 0)` })
    .from(earnings)
    .where(
      and(
        eq(earnings.userId, userId),
        gte(earnings.createdAt, lastMonthStart),
        sql`${earnings.createdAt} < ${thisMonthStart}`
      )
    );

  const thisMonth = Number(thisMonthEarnings?.total ?? 0);
  const lastMonth = Number(lastMonthEarnings?.total ?? 0);
  const earningsGrowth = lastMonth > 0 ? Math.min((thisMonth / lastMonth) * 100, 100) : thisMonth > 0 ? 100 : 50;

  // Weighted score
  const overall = Math.round(
    linkHealth * 0.4 + coverage * 0.2 + freshness * 0.25 + earningsGrowth * 0.15
  );

  return {
    overall,
    grade: getGrade(overall),
    breakdown: {
      linkHealth: Math.round(linkHealth),
      coverage: Math.round(coverage),
      freshness: Math.round(freshness),
      earningsGrowth: Math.round(earningsGrowth),
    },
  };
}
