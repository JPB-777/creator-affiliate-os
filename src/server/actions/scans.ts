"use server";

import { db } from "@/lib/db";
import { scans, urls } from "@/lib/db/schema";
import { eq, and, or, isNull, lt } from "drizzle-orm";
import { after } from "next/server";
import { executeScan } from "@/lib/scanner/run-scan";
import { checkScanRateLimit } from "@/lib/rate-limit";

async function acquireScanLock(urlId: string): Promise<boolean> {
  const staleThreshold = new Date(Date.now() - 10 * 60 * 1000);
  const result = await db
    .update(urls)
    .set({ scanningLockedAt: new Date() })
    .where(
      and(
        eq(urls.id, urlId),
        or(
          isNull(urls.scanningLockedAt),
          lt(urls.scanningLockedAt, staleThreshold)
        )
      )
    )
    .returning({ id: urls.id });

  return result.length > 0;
}

export async function triggerScan(urlId: string, userId: string, options?: { skipRateLimit?: boolean }) {
  // Rate limit check (skip for cron jobs)
  if (!options?.skipRateLimit) {
    const { success } = await checkScanRateLimit(userId);
    if (!success) {
      throw new Error("Daily scan limit reached (50/day). Try again tomorrow.");
    }
  }

  // Acquire lock to prevent concurrent scans on same URL
  const locked = await acquireScanLock(urlId);
  if (!locked) {
    throw new Error("A scan is already running for this URL. Please wait.");
  }

  // Create scan record
  const [scan] = await db
    .insert(scans)
    .values({
      userId,
      urlId,
      status: "pending",
      startedAt: new Date(),
    })
    .returning();

  // Execute scan in background after response is sent
  after(executeScan(scan.id, urlId, userId));

  return { scanId: scan.id, status: "pending" };
}
