"use server";

import { db } from "@/lib/db";
import { userPreferences } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function saveOnboardingStep(step: string, data?: Record<string, string>) {
  const user = await requireUser();

  const [existing] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, user.id));

  const currentState = existing?.onboardingState ?? {
    currentStep: 0,
    completedSteps: [],
  };

  const completedSteps = currentState.completedSteps.includes(step)
    ? currentState.completedSteps
    : [...currentState.completedSteps, step];

  const newState = {
    ...currentState,
    completedSteps,
    ...(data?.urlAdded ? { urlAdded: data.urlAdded } : {}),
  };

  if (existing) {
    await db
      .update(userPreferences)
      .set({ onboardingState: newState, updatedAt: new Date() })
      .where(eq(userPreferences.userId, user.id));
  } else {
    await db.insert(userPreferences).values({
      userId: user.id,
      onboardingState: newState,
    });
  }

  revalidatePath("/onboarding");
}

export async function completeOnboarding() {
  const user = await requireUser();

  const [existing] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, user.id));

  if (existing) {
    await db
      .update(userPreferences)
      .set({ onboardingCompletedAt: new Date(), updatedAt: new Date() })
      .where(eq(userPreferences.userId, user.id));
  } else {
    await db.insert(userPreferences).values({
      userId: user.id,
      onboardingCompletedAt: new Date(),
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
}

export async function skipOnboarding() {
  return completeOnboarding();
}
