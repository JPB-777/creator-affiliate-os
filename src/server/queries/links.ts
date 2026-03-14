import { db } from "@/lib/db";
import { links, urls } from "@/lib/db/schema";
import { eq, and, desc, count, ilike, or, type SQL } from "drizzle-orm";

export async function getLinksByUrl(urlId: string, userId: string) {
  return db
    .select()
    .from(links)
    .where(and(eq(links.urlId, urlId), eq(links.userId, userId)))
    .orderBy(desc(links.isAffiliate), links.status);
}

export async function getAllUserLinks(
  userId: string,
  page: number = 1,
  pageSize: number = 20,
  filters?: { search?: string; network?: string; status?: string }
) {
  const conditions: SQL[] = [eq(links.userId, userId), eq(links.isAffiliate, true)];

  if (filters?.search) {
    const term = `%${filters.search}%`;
    conditions.push(or(ilike(links.originalUrl, term), ilike(links.anchorText, term))!);
  }
  if (filters?.network) {
    conditions.push(eq(links.networkName, filters.network));
  }
  if (filters?.status) {
    conditions.push(eq(links.status, filters.status as typeof links.status.enumValues[number]));
  }

  const where = and(...conditions);

  const [{ total }] = await db
    .select({ total: count() })
    .from(links)
    .where(where);

  const data = await db
    .select()
    .from(links)
    .where(where)
    .orderBy(desc(links.isAffiliate), links.status)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { data, total, totalPages: Math.ceil(total / pageSize) };
}

export async function getBrokenLinks(userId: string) {
  return db
    .select()
    .from(links)
    .where(and(eq(links.userId, userId), eq(links.status, "broken")));
}

export async function getBrokenLinksWithUrls(
  userId: string,
  page: number = 1,
  pageSize: number = 20,
  filters?: { search?: string; network?: string }
) {
  const conditions: SQL[] = [
    eq(links.userId, userId),
    eq(links.status, "broken"),
    eq(links.isAffiliate, true),
  ];

  if (filters?.search) {
    const term = `%${filters.search}%`;
    conditions.push(or(ilike(links.originalUrl, term), ilike(links.anchorText, term))!);
  }
  if (filters?.network) {
    conditions.push(eq(links.networkName, filters.network));
  }

  const where = and(...conditions);

  const [{ total }] = await db
    .select({ total: count() })
    .from(links)
    .where(where);

  const data = await db
    .select({
      id: links.id,
      urlId: links.urlId,
      originalUrl: links.originalUrl,
      resolvedUrl: links.resolvedUrl,
      anchorText: links.anchorText,
      status: links.status,
      httpStatusCode: links.httpStatusCode,
      networkName: links.networkName,
      suggestedReplacement: links.suggestedReplacement,
      lastCheckedAt: links.lastCheckedAt,
      urlTitle: urls.title,
      urlUrl: urls.url,
    })
    .from(links)
    .innerJoin(urls, eq(links.urlId, urls.id))
    .where(where)
    .orderBy(links.networkName, links.originalUrl)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { data, total, totalPages: Math.ceil(total / pageSize) };
}
