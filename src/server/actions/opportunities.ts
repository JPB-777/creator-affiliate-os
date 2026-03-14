"use server";

import { db } from "@/lib/db";
import { opportunities } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { requireUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function dismissOpportunity(id: string) {
  const user = await requireUser();
  await db
    .update(opportunities)
    .set({ isDismissed: true })
    .where(and(eq(opportunities.id, id), eq(opportunities.userId, user.id)));
  revalidatePath("/opportunities");
}

export async function bulkDismissOpportunities(ids: string[]) {
  const user = await requireUser();
  if (ids.length === 0) return;
  await db
    .update(opportunities)
    .set({ isDismissed: true })
    .where(and(inArray(opportunities.id, ids), eq(opportunities.userId, user.id)));
  revalidatePath("/opportunities");
}
