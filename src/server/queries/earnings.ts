import { db } from "@/lib/db";
import { earnings } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function getEarnings(userId: string) {
  return db
    .select()
    .from(earnings)
    .where(eq(earnings.userId, userId))
    .orderBy(desc(earnings.period), earnings.networkName);
}

export async function getEarningsSummary(userId: string) {
  const [totals] = await db
    .select({
      allTime: sql<string>`coalesce(sum(${earnings.amount}::numeric), 0)::text`,
    })
    .from(earnings)
    .where(eq(earnings.userId, userId));

  const now = new Date();
  const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [monthly] = await db
    .select({
      thisMonth: sql<string>`coalesce(sum(${earnings.amount}::numeric), 0)::text`,
    })
    .from(earnings)
    .where(
      sql`${earnings.userId} = ${userId} AND ${earnings.period} = ${currentPeriod}`
    );

  const topNetwork = await db
    .select({
      network: earnings.networkName,
      total: sql<string>`sum(${earnings.amount}::numeric)::text`,
    })
    .from(earnings)
    .where(eq(earnings.userId, userId))
    .groupBy(earnings.networkName)
    .orderBy(desc(sql`sum(${earnings.amount}::numeric)`))
    .limit(1);

  return {
    allTime: totals?.allTime ?? "0",
    thisMonth: monthly?.thisMonth ?? "0",
    topNetwork: topNetwork[0] ?? null,
  };
}
