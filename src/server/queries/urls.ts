import { db } from "@/lib/db";
import { urls } from "@/lib/db/schema";
import { eq, desc, and, asc, sql } from "drizzle-orm";

export async function getUserUrls(userId: string) {
  return db
    .select()
    .from(urls)
    .where(eq(urls.userId, userId))
    .orderBy(desc(urls.createdAt));
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
