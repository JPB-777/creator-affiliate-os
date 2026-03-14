import { db } from "@/lib/db";
import { activityLog } from "@/lib/db/schema";
import { eq, desc, count } from "drizzle-orm";

export async function getActivityLog(
  userId: string,
  page: number = 1,
  pageSize: number = 30
) {
  const [{ total }] = await db
    .select({ total: count() })
    .from(activityLog)
    .where(eq(activityLog.userId, userId));

  const data = await db
    .select()
    .from(activityLog)
    .where(eq(activityLog.userId, userId))
    .orderBy(desc(activityLog.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { data, total, totalPages: Math.ceil(total / pageSize) };
}
