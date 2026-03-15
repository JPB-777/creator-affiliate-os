"use server";

import { db } from "@/lib/db";
import { urls } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { triggerScan } from "./scans";
import { logActivity } from "@/lib/activity-logger";

export async function addUrl(formData: FormData) {
  const user = await requireUser();
  const url = formData.get("url") as string;
  const platform = (formData.get("platform") as string) || "blog";

  if (!url) throw new Error("URL is required");

  // Normalize URL
  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith("http")) {
    normalizedUrl = "https://" + normalizedUrl;
  }

  // Check for existing URL (unique constraint)
  const [existing] = await db
    .select({ id: urls.id })
    .from(urls)
    .where(and(eq(urls.userId, user.id), eq(urls.url, normalizedUrl)));

  if (existing) {
    throw new Error("This URL has already been added.");
  }

  const [newUrl] = await db
    .insert(urls)
    .values({
      userId: user.id,
      url: normalizedUrl,
      platform,
    })
    .returning();

  // Auto-trigger scan
  await triggerScan(newUrl.id, user.id);

  await logActivity({ userId: user.id, action: "url_added", entityType: "url", entityId: newUrl.id, metadata: { description: normalizedUrl } });
  revalidatePath("/urls");
  revalidatePath("/dashboard");
  return newUrl;
}

export async function deleteUrl(id: string) {
  const user = await requireUser();
  await db
    .delete(urls)
    .where(and(eq(urls.id, id), eq(urls.userId, user.id)));
  await logActivity({ userId: user.id, action: "url_deleted", entityType: "url", entityId: id });
  revalidatePath("/urls");
  revalidatePath("/dashboard");
}

export async function bulkAddUrls(formData: FormData) {
  const user = await requireUser();
  const rawUrls = formData.get("urls") as string;
  const platform = (formData.get("platform") as string) || "blog";

  if (!rawUrls) throw new Error("URLs are required");

  const urlLines = rawUrls
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, 20); // Max 20 URLs per batch

  if (urlLines.length === 0) throw new Error("No valid URLs provided");

  // Get existing URLs for this user to detect duplicates
  const existingUrls = await db
    .select({ url: urls.url })
    .from(urls)
    .where(eq(urls.userId, user.id));
  const existingSet = new Set(existingUrls.map((u) => u.url));

  const results: { url: string; status: "added" | "duplicate" | "error"; error?: string }[] = [];

  for (const rawUrl of urlLines) {
    let normalizedUrl = rawUrl;
    if (!normalizedUrl.startsWith("http")) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    if (existingSet.has(normalizedUrl)) {
      results.push({ url: normalizedUrl, status: "duplicate" });
      continue;
    }

    try {
      const [newUrl] = await db
        .insert(urls)
        .values({ userId: user.id, url: normalizedUrl, platform })
        .returning();

      await triggerScan(newUrl.id, user.id);
      existingSet.add(normalizedUrl);
      results.push({ url: normalizedUrl, status: "added" });
    } catch (error) {
      results.push({
        url: normalizedUrl,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  revalidatePath("/urls");
  revalidatePath("/dashboard");
  return results;
}

export async function updateUrlTags(urlId: string, tags: string[]) {
  const user = await requireUser();
  await db
    .update(urls)
    .set({ tags, updatedAt: new Date() })
    .where(and(eq(urls.id, urlId), eq(urls.userId, user.id)));
  revalidatePath("/urls");
}

export async function updateScanFrequency(
  urlId: string,
  frequency: "daily" | "weekly" | "biweekly" | "monthly" | "manual"
) {
  const user = await requireUser();
  await db
    .update(urls)
    .set({ scanFrequency: frequency, updatedAt: new Date() })
    .where(and(eq(urls.id, urlId), eq(urls.userId, user.id)));
  revalidatePath("/urls");
}

export async function rescanUrl(id: string) {
  const user = await requireUser();
  await triggerScan(id, user.id);
  await logActivity({ userId: user.id, action: "url_rescanned", entityType: "url", entityId: id });
  revalidatePath(`/urls/${id}`);
  revalidatePath("/urls");
  revalidatePath("/dashboard");
}
