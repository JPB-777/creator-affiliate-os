import { db } from "@/lib/db";
import { earnings, urls } from "@/lib/db/schema";
import { eq, desc, sql, count, ilike, or, type SQL, and } from "drizzle-orm";

export async function getEarnings(
  userId: string,
  page: number = 1,
  pageSize: number = 20,
  filters?: { search?: string; network?: string; urlId?: string }
) {
  const conditions: SQL[] = [eq(earnings.userId, userId)];

  if (filters?.search) {
    const term = `%${filters.search}%`;
    conditions.push(or(ilike(earnings.networkName, term), ilike(earnings.notes, term))!);
  }
  if (filters?.network) {
    conditions.push(eq(earnings.networkName, filters.network));
  }
  if (filters?.urlId) {
    conditions.push(eq(earnings.urlId, filters.urlId));
  }

  const where = and(...conditions);

  const [{ total }] = await db
    .select({ total: count() })
    .from(earnings)
    .where(where);

  const data = await db
    .select()
    .from(earnings)
    .where(where)
    .orderBy(desc(earnings.period), earnings.networkName)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { data, total, totalPages: Math.ceil(total / pageSize) };
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

export async function getMonthlyEarnings(userId: string) {
  const rows = await db
    .select({
      period: earnings.period,
      network: earnings.networkName,
      total: sql<string>`sum(${earnings.amount}::numeric)::text`,
    })
    .from(earnings)
    .where(eq(earnings.userId, userId))
    .groupBy(earnings.period, earnings.networkName)
    .orderBy(earnings.period);

  return rows;
}

export async function getEarningsByUrl(urlId: string, userId: string) {
  const rows = await db
    .select({
      id: earnings.id,
      networkName: earnings.networkName,
      amount: earnings.amount,
      period: earnings.period,
      notes: earnings.notes,
    })
    .from(earnings)
    .where(and(eq(earnings.urlId, urlId), eq(earnings.userId, userId)))
    .orderBy(desc(earnings.period));

  return rows;
}

export async function getUrlEarningsTotal(urlId: string, userId: string) {
  const [result] = await db
    .select({
      total: sql<string>`coalesce(sum(${earnings.amount}::numeric), 0)::text`,
    })
    .from(earnings)
    .where(and(eq(earnings.urlId, urlId), eq(earnings.userId, userId)));

  return result?.total ?? "0";
}
