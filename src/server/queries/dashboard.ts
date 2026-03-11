import { db } from "@/lib/db";
import { urls, links, earnings, scans } from "@/lib/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";

export async function getDashboardStats(userId: string) {
  const [urlCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(urls)
    .where(eq(urls.userId, userId));

  const [linkStats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      affiliate: sql<number>`count(*) filter (where ${links.isAffiliate} = true)::int`,
      broken: sql<number>`count(*) filter (where ${links.status} = 'broken')::int`,
    })
    .from(links)
    .where(eq(links.userId, userId));

  const [earningsTotal] = await db
    .select({
      total: sql<string>`coalesce(sum(${earnings.amount}::numeric), 0)::text`,
    })
    .from(earnings)
    .where(eq(earnings.userId, userId));

  const networkDistribution = await db
    .select({
      network: links.networkName,
      count: sql<number>`count(*)::int`,
    })
    .from(links)
    .where(and(eq(links.userId, userId), eq(links.isAffiliate, true)))
    .groupBy(links.networkName)
    .orderBy(desc(sql`count(*)`));

  const recentScans = await db
    .select({
      id: scans.id,
      status: scans.status,
      totalLinksFound: scans.totalLinksFound,
      affiliateLinksFound: scans.affiliateLinksFound,
      brokenLinksFound: scans.brokenLinksFound,
      completedAt: scans.completedAt,
      createdAt: scans.createdAt,
      urlId: scans.urlId,
    })
    .from(scans)
    .where(eq(scans.userId, userId))
    .orderBy(desc(scans.createdAt))
    .limit(5);

  return {
    totalUrls: urlCount?.count ?? 0,
    totalAffiliateLinks: linkStats?.affiliate ?? 0,
    brokenLinks: linkStats?.broken ?? 0,
    totalEarnings: earningsTotal?.total ?? "0",
    networkDistribution: networkDistribution.filter((n) => n.network !== null),
    recentScans,
  };
}

export async function getTopPerformingUrls(userId: string) {
  // Join urls → links (by urlId) → earnings (by networkName)
  // to find which pages' affiliate networks generate the most revenue
  const rows = await db
    .select({
      urlId: urls.id,
      urlTitle: urls.title,
      urlUrl: urls.url,
      totalEarnings: sql<string>`coalesce(sum(${earnings.amount}::numeric), 0)::text`,
      networkCount: sql<number>`count(distinct ${links.networkName})::int`,
    })
    .from(urls)
    .innerJoin(links, and(eq(links.urlId, urls.id), eq(links.isAffiliate, true)))
    .innerJoin(earnings, and(eq(earnings.userId, userId), eq(earnings.networkName, links.networkName)))
    .where(eq(urls.userId, userId))
    .groupBy(urls.id, urls.title, urls.url)
    .orderBy(desc(sql`sum(${earnings.amount}::numeric)`))
    .limit(5);

  return rows;
}
