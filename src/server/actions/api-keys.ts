"use server";

import { db } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { createHash, randomBytes } from "crypto";

export async function createApiKey(name: string): Promise<{ key: string; prefix: string }> {
  const user = await requireUser();

  // Generate key: aos_ + 64 hex chars
  const rawKey = randomBytes(32).toString("hex");
  const fullKey = `aos_${rawKey}`;
  const prefix = fullKey.slice(0, 12);
  const keyHash = createHash("sha256").update(fullKey).digest("hex");

  await db.insert(apiKeys).values({
    userId: user.id,
    name,
    keyPrefix: prefix,
    keyHash,
  });

  revalidatePath("/settings");
  return { key: fullKey, prefix };
}

export async function revokeApiKey(id: string) {
  const user = await requireUser();
  await db
    .delete(apiKeys)
    .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, user.id)));
  revalidatePath("/settings");
}
