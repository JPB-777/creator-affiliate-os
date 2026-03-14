import { db } from "@/lib/db";
import { apiKeys, user as userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";
import { NextRequest } from "next/server";

export async function authenticateApiKey(
  request: NextRequest
): Promise<{ userId: string } | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const key = authHeader.slice(7);
  if (!key.startsWith("aos_")) return null;

  const keyHash = createHash("sha256").update(key).digest("hex");

  const [apiKey] = await db
    .select({
      id: apiKeys.id,
      userId: apiKeys.userId,
      expiresAt: apiKeys.expiresAt,
    })
    .from(apiKeys)
    .where(eq(apiKeys.keyHash, keyHash));

  if (!apiKey) return null;

  // Check expiration
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return null;

  // Update last used
  await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, apiKey.id));

  return { userId: apiKey.userId };
}
