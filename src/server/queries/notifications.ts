import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq, and, desc, sql, count } from "drizzle-orm";

export async function getNotifications(
  userId: string,
  page: number = 1,
  pageSize: number = 20,
  unreadOnly: boolean = false
) {
  const conditions = [eq(notifications.userId, userId)];
  if (unreadOnly) {
    conditions.push(eq(notifications.isRead, false));
  }

  const where = and(...conditions);

  const [{ total }] = await db
    .select({ total: count() })
    .from(notifications)
    .where(where);

  const data = await db
    .select()
    .from(notifications)
    .where(where)
    .orderBy(desc(notifications.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { data, total, totalPages: Math.ceil(total / pageSize) };
}

export async function getUnreadCount(userId: string): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

  return result?.count ?? 0;
}
