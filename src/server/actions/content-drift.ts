"use server";

import { db } from "@/lib/db";
import { contentDrifts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function markDriftAsReviewed(id: string) {
  const user = await requireUser();
  await db
    .update(contentDrifts)
    .set({ isReviewed: true })
    .where(and(eq(contentDrifts.id, id), eq(contentDrifts.userId, user.id)));
  revalidatePath("/content-drift");
}

export async function dismissDrift(id: string) {
  const user = await requireUser();
  await db
    .update(contentDrifts)
    .set({ isReviewed: true })
    .where(and(eq(contentDrifts.id, id), eq(contentDrifts.userId, user.id)));
  revalidatePath("/content-drift");
}
