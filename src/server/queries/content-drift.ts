import { db } from "@/lib/db";
import { contentDrifts, urls } from "@/lib/db/schema";
import { eq, and, desc, count, sql } from "drizzle-orm";

export async function getContentDrifts(
  userId: string,
  page: number = 1,
  pageSize: number = 20,
  showReviewed: boolean = false
) {
  const conditions = [eq(contentDrifts.userId, userId)];
  if (!showReviewed) {
    conditions.push(eq(contentDrifts.isReviewed, false));
  }
  const where = and(...conditions);

  const [{ total }] = await db
    .select({ total: count() })
    .from(contentDrifts)
    .where(where);

  const data = await db
    .select({
      id: contentDrifts.id,
      linkOriginalUrl: contentDrifts.linkOriginalUrl,
      previousSnippet: contentDrifts.previousSnippet,
      currentSnippet: contentDrifts.currentSnippet,
      isReviewed: contentDrifts.isReviewed,
      detectedAt: contentDrifts.detectedAt,
      urlId: contentDrifts.urlId,
      urlTitle: urls.title,
      urlUrl: urls.url,
    })
    .from(contentDrifts)
    .innerJoin(urls, eq(urls.id, contentDrifts.urlId))
    .where(where)
    .orderBy(desc(contentDrifts.detectedAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { data, total, totalPages: Math.ceil(total / pageSize) };
}

export async function getUnreviewedDriftCount(userId: string): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(contentDrifts)
    .where(and(eq(contentDrifts.userId, userId), eq(contentDrifts.isReviewed, false)));

  return result?.count ?? 0;
}
