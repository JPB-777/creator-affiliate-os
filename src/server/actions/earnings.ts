"use server";

import { db } from "@/lib/db";
import { earnings } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function addEarning(formData: FormData) {
  const user = await requireUser();
  const networkName = formData.get("networkName") as string;
  const amount = formData.get("amount") as string;
  const period = formData.get("period") as string;
  const notes = formData.get("notes") as string;

  if (!networkName || !amount || !period) {
    throw new Error("Network, amount, and period are required");
  }

  await db.insert(earnings).values({
    userId: user.id,
    networkName,
    amount,
    period,
    notes: notes || null,
  });

  revalidatePath("/earnings");
  revalidatePath("/dashboard");
}

export async function updateEarning(id: string, formData: FormData) {
  const user = await requireUser();
  const networkName = formData.get("networkName") as string;
  const amount = formData.get("amount") as string;
  const period = formData.get("period") as string;
  const notes = formData.get("notes") as string;

  await db
    .update(earnings)
    .set({
      networkName,
      amount,
      period,
      notes: notes || null,
      updatedAt: new Date(),
    })
    .where(and(eq(earnings.id, id), eq(earnings.userId, user.id)));

  revalidatePath("/earnings");
  revalidatePath("/dashboard");
}

export async function deleteEarning(id: string) {
  const user = await requireUser();
  await db
    .delete(earnings)
    .where(and(eq(earnings.id, id), eq(earnings.userId, user.id)));
  revalidatePath("/earnings");
  revalidatePath("/dashboard");
}
