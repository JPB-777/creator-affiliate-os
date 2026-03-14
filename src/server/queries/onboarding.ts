import { db } from "@/lib/db";
import { userPreferences } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getUserPreferences(userId: string) {
  const [prefs] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId));
  return prefs ?? null;
}

export async function isOnboardingComplete(userId: string) {
  const prefs = await getUserPreferences(userId);
  return !!prefs?.onboardingCompletedAt;
}
