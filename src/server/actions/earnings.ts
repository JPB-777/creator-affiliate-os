"use server";

import { db } from "@/lib/db";
import { earnings } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity-logger";

export async function addEarning(formData: FormData) {
  const user = await requireUser();
  const networkName = formData.get("networkName") as string;
  const amount = formData.get("amount") as string;
  const period = formData.get("period") as string;
  const notes = formData.get("notes") as string;
  const urlId = formData.get("urlId") as string | null;

  if (!networkName || !amount || !period) {
    throw new Error("Network, amount, and period are required");
  }

  const [inserted] = await db.insert(earnings).values({
    userId: user.id,
    networkName,
    amount,
    period,
    notes: notes || null,
    urlId: urlId || null,
  }).returning({ id: earnings.id });

  await logActivity({ userId: user.id, action: "earning_added", entityType: "earning", entityId: inserted.id, metadata: { description: `$${amount} from ${networkName} (${period})` } });
  revalidatePath("/earnings");
  revalidatePath("/dashboard");
}

export async function updateEarning(id: string, formData: FormData) {
  const user = await requireUser();
  const networkName = formData.get("networkName") as string;
  const amount = formData.get("amount") as string;
  const period = formData.get("period") as string;
  const notes = formData.get("notes") as string;

  const urlId = formData.get("urlId") as string | null;

  await db
    .update(earnings)
    .set({
      networkName,
      amount,
      period,
      notes: notes || null,
      urlId: urlId || null,
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
  await logActivity({ userId: user.id, action: "earning_deleted", entityType: "earning", entityId: id });
  revalidatePath("/earnings");
  revalidatePath("/dashboard");
}
