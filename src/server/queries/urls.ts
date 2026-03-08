import { db } from "@/lib/db";
import { urls } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

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
