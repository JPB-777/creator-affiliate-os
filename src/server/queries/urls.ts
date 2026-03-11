import { db } from "@/lib/db";
import { urls } from "@/lib/db/schema";
import { eq, desc, and, asc, sql, count, ilike, or, type SQL } from "drizzle-orm";

export async function getUserUrls(
  userId: string,
  page: number = 1,
  pageSize: number = 20,
  filters?: { search?: string; platform?: string }
) {
  const conditions: SQL[] = [eq(urls.userId, userId)];

  if (filters?.search) {
    const term = `%${filters.search}%`;
    conditions.push(or(ilike(urls.url, term), ilike(urls.title, term))!);
  }
  if (filters?.platform) {
    conditions.push(eq(urls.platform, filters.platform));
  }

  const where = and(...conditions);

  const [{ total }] = await db
    .select({ total: count() })
    .from(urls)
    .where(where);

  const data = await db
    .select()
    .from(urls)
    .where(where)
    .orderBy(desc(urls.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { data, total, totalPages: Math.ceil(total / pageSize) };
}

export async function getUrlById(id: string, userId: string) {
  const [url] = await db
    .select()
    .from(urls)
    .where(and(eq(urls.id, id), eq(urls.userId, userId)));
  return url ?? null;
}

export async function getStaleUrlsForCron(limit: number = 10) {
  return db
    .select({ id: urls.id, userId: urls.userId, url: urls.url })
    .from(urls)
    .orderBy(asc(sql`coalesce(${urls.lastScannedAt}, '1970-01-01')`))
    .limit(limit);
}
