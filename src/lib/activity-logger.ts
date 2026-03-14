import { db } from "@/lib/db";
import { activityLog } from "@/lib/db/schema";

export async function logActivity(params: {
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await db.insert(activityLog).values({
      userId: params.userId,
      action: params.action,
      entityType: params.entityType ?? null,
      entityId: params.entityId ?? null,
      metadata: params.metadata ?? null,
    });
  } catch {
    // Best-effort — never fail the parent action
  }
}
