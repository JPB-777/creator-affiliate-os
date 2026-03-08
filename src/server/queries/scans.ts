import { db } from "@/lib/db";
import { scans } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function getScanHistory(urlId: string, userId: string) {
  return db
    .select()
    .from(scans)
    .where(and(eq(scans.urlId, urlId), eq(scans.userId, userId)))
    .orderBy(desc(scans.createdAt));
}

export async function getLatestScan(urlId: string, userId: string) {
  const [scan] = await db
    .select()
    .from(scans)
    .where(and(eq(scans.urlId, urlId), eq(scans.userId, userId)))
    .orderBy(desc(scans.createdAt))
    .limit(1);
  return scan ?? null;
}
