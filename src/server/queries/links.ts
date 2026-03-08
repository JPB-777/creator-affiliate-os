import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function getLinksByUrl(urlId: string, userId: string) {
  return db
    .select()
    .from(links)
    .where(and(eq(links.urlId, urlId), eq(links.userId, userId)))
    .orderBy(desc(links.isAffiliate), links.status);
}

export async function getAllUserLinks(userId: string) {
  return db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.isAffiliate), links.status);
}

export async function getBrokenLinks(userId: string) {
  return db
    .select()
    .from(links)
    .where(and(eq(links.userId, userId), eq(links.status, "broken")));
}
