"use server";

import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function markNotificationAsRead(id: string) {
  const user = await requireUser();
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, id), eq(notifications.userId, user.id)));
  revalidatePath("/dashboard");
}

export async function markAllNotificationsAsRead() {
  const user = await requireUser();
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.userId, user.id), eq(notifications.isRead, false)));
  revalidatePath("/dashboard");
}

// Helper for creating notifications from other server actions
export async function createNotification(params: {
  userId: string;
  type: "broken_link" | "scan_complete" | "scan_failed" | "weekly_report" | "system";
  title: string;
  message: string;
  actionUrl?: string;
}) {
  try {
    await db.insert(notifications).values({
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      actionUrl: params.actionUrl,
    });
  } catch {
    // Best-effort — never fail the parent action
  }
}
