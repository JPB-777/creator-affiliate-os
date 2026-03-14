import { db } from "@/lib/db";
import { opportunities, urls } from "@/lib/db/schema";
import { eq, and, desc, count, sql } from "drizzle-orm";

export async function getOpportunities(
  userId: string,
  page: number = 1,
  pageSize: number = 20,
  showDismissed: boolean = false
) {
  const conditions = [eq(opportunities.userId, userId)];
  if (!showDismissed) {
    conditions.push(eq(opportunities.isDismissed, false));
  }
  const where = and(...conditions);

  const [{ total }] = await db
    .select({ total: count() })
    .from(opportunities)
    .where(where);

  const data = await db
    .select({
      id: opportunities.id,
      linkOriginalUrl: opportunities.linkOriginalUrl,
      anchorText: opportunities.anchorText,
      suggestedNetwork: opportunities.suggestedNetwork,
      reason: opportunities.reason,
      isDismissed: opportunities.isDismissed,
      createdAt: opportunities.createdAt,
      urlId: opportunities.urlId,
      urlTitle: urls.title,
      urlUrl: urls.url,
    })
    .from(opportunities)
    .innerJoin(urls, eq(urls.id, opportunities.urlId))
    .where(where)
    .orderBy(desc(opportunities.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { data, total, totalPages: Math.ceil(total / pageSize) };
}

export async function getOpportunityCount(userId: string): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(opportunities)
    .where(and(eq(opportunities.userId, userId), eq(opportunities.isDismissed, false)));

  return result?.count ?? 0;
}
