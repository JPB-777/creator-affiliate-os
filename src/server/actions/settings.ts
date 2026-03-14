"use server";

import { db } from "@/lib/db";
import { userPreferences } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function toggleWeeklyReport(enabled: boolean) {
  const user = await requireUser();

  const [existing] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, user.id));

  if (existing) {
    await db
      .update(userPreferences)
      .set({ weeklyReportEnabled: enabled, updatedAt: new Date() })
      .where(eq(userPreferences.userId, user.id));
  } else {
    await db.insert(userPreferences).values({
      userId: user.id,
      weeklyReportEnabled: enabled,
    });
  }

  revalidatePath("/settings");
}
