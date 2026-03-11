import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";
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
