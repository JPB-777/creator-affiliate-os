"use server";

import { db } from "@/lib/db";
import { urls } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { fetchSitemap } from "@/lib/scanner/sitemap-parser";
import { triggerScan } from "./scans";

export async function fetchSitemapUrls(sitemapUrl: string) {
  await requireUser();

  let normalizedUrl = sitemapUrl.trim();
  if (!normalizedUrl.startsWith("http")) {
    normalizedUrl = "https://" + normalizedUrl;
  }

  const entries = await fetchSitemap(normalizedUrl);
  return entries;
}

export async function importSitemapUrls(
  urlList: string[],
  platform: string
) {
  const user = await requireUser();

  // Get existing URLs
  const existing = await db
    .select({ url: urls.url })
    .from(urls)
    .where(eq(urls.userId, user.id));
  const existingSet = new Set(existing.map((u) => u.url));

  const results: { url: string; status: "added" | "duplicate" | "error" }[] = [];
  const toImport = urlList.slice(0, 200);

  // Import in batches of 20
  for (let i = 0; i < toImport.length; i += 20) {
    const batch = toImport.slice(i, i + 20);
    for (const rawUrl of batch) {
      if (existingSet.has(rawUrl)) {
        results.push({ url: rawUrl, status: "duplicate" });
        continue;
      }

      try {
        const [newUrl] = await db
          .insert(urls)
          .values({ userId: user.id, url: rawUrl, platform })
          .returning();

        await triggerScan(newUrl.id, user.id);
        existingSet.add(rawUrl);
        results.push({ url: rawUrl, status: "added" });
      } catch {
        results.push({ url: rawUrl, status: "error" });
      }
    }
  }

  revalidatePath("/urls");
  revalidatePath("/dashboard");
  return results;
}
