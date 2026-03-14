import { db } from "@/lib/db";
import { urls, links, earnings, scans, userPreferences } from "@/lib/db/schema";
import { user as userTable } from "@/lib/db/schema";
import { eq, and, gte, sql, desc } from "drizzle-orm";

export async function getUsersForWeeklyReport() {
  const rows = await db
    .select({
      userId: userPreferences.userId,
      email: userTable.email,
      name: userTable.name,
    })
    .from(userPreferences)
    .innerJoin(userTable, eq(userTable.id, userPreferences.userId))
    .where(eq(userPreferences.weeklyReportEnabled, true));

  return rows;
}

export async function getWeeklyReportData(userId: string) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Total URLs
  const [urlCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(urls)
    .where(eq(urls.userId, userId));

  // Broken links count
  const [brokenCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(links)
    .where(and(eq(links.userId, userId), eq(links.isAffiliate, true), eq(links.status, "broken")));

  // Scans this week
  const [scanCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(scans)
    .where(and(eq(scans.userId, userId), gte(scans.createdAt, oneWeekAgo)));

  // Earnings this week
  const [weekEarnings] = await db
    .select({ total: sql<string>`coalesce(sum(${earnings.amount}::numeric), 0)::text` })
    .from(earnings)
    .where(and(eq(earnings.userId, userId), gte(earnings.createdAt, oneWeekAgo)));

  // New broken links this week (scans with broken > 0)
  const recentBroken = await db
    .select({
      urlTitle: urls.title,
      urlUrl: urls.url,
      brokenCount: scans.brokenLinksFound,
    })
    .from(scans)
    .innerJoin(urls, eq(urls.id, scans.urlId))
    .where(
      and(
        eq(scans.userId, userId),
        gte(scans.createdAt, oneWeekAgo),
        sql`${scans.brokenLinksFound} > 0`
      )
    )
    .orderBy(desc(scans.createdAt))
    .limit(5);

  return {
    totalUrls: Number(urlCount?.count ?? 0),
    brokenLinks: Number(brokenCount?.count ?? 0),
    scansThisWeek: Number(scanCount?.count ?? 0),
    earningsThisWeek: weekEarnings?.total ?? "0",
    recentBroken,
  };
}
