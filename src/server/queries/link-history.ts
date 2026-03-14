import { db } from "@/lib/db";
import { linkStatusHistory } from "@/lib/db/schema";
import { eq, and, gte, desc, sql } from "drizzle-orm";

export async function getLinkHistory(
  linkOriginalUrl: string,
  urlId: string,
  userId: string,
  days: number = 30
) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return db
    .select()
    .from(linkStatusHistory)
    .where(
      and(
        eq(linkStatusHistory.userId, userId),
        eq(linkStatusHistory.urlId, urlId),
        eq(linkStatusHistory.linkOriginalUrl, linkOriginalUrl),
        gte(linkStatusHistory.checkedAt, since)
      )
    )
    .orderBy(desc(linkStatusHistory.checkedAt));
}

export async function getUrlHealthTimeline(
  urlId: string,
  userId: string,
  days: number = 30
) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const rows = await db
    .select({
      day: sql<string>`to_char(${linkStatusHistory.checkedAt}, 'YYYY-MM-DD')`,
      healthy: sql<number>`count(*) filter (where ${linkStatusHistory.status} = 'healthy')`,
      broken: sql<number>`count(*) filter (where ${linkStatusHistory.status} = 'broken')`,
      redirect: sql<number>`count(*) filter (where ${linkStatusHistory.status} = 'redirect')`,
      timeout: sql<number>`count(*) filter (where ${linkStatusHistory.status} = 'timeout')`,
    })
    .from(linkStatusHistory)
    .where(
      and(
        eq(linkStatusHistory.userId, userId),
        eq(linkStatusHistory.urlId, urlId),
        gte(linkStatusHistory.checkedAt, since)
      )
    )
    .groupBy(sql`to_char(${linkStatusHistory.checkedAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${linkStatusHistory.checkedAt}, 'YYYY-MM-DD')`);

  return rows.map((r) => ({
    day: r.day,
    healthy: Number(r.healthy),
    broken: Number(r.broken),
    redirect: Number(r.redirect),
    timeout: Number(r.timeout),
  }));
}
