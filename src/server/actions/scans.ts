"use server";

import { db } from "@/lib/db";
import { scans, links, urls } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { fetchPage } from "@/lib/scanner/fetcher";
import { extractLinks, extractTitle } from "@/lib/scanner/parser";
import { detectAffiliateLinks } from "@/lib/scanner/detector";
import { checkLinks } from "@/lib/scanner/checker";
import { sendBrokenLinksAlert } from "@/lib/email";
import { user as userTable } from "@/lib/db/schema";

export async function triggerScan(urlId: string, userId: string) {
  // Create scan record
  const [scan] = await db
    .insert(scans)
    .values({
      userId,
      urlId,
      status: "scanning",
      startedAt: new Date(),
    })
    .returning();

  try {
    // Get the URL
    const [urlRecord] = await db
      .select()
      .from(urls)
      .where(and(eq(urls.id, urlId), eq(urls.userId, userId)));

    if (!urlRecord) throw new Error("URL not found");

    // Fetch the page
    const { html } = await fetchPage(urlRecord.url);

    // Extract title
    const title = extractTitle(html);
    if (title) {
      await db.update(urls).set({ title }).where(eq(urls.id, urlId));
    }

    // Extract and detect links
    const extracted = extractLinks(html, urlRecord.url);
    const detected = detectAffiliateLinks(extracted);

    // Delete old links for this URL
    await db
      .delete(links)
      .where(and(eq(links.urlId, urlId), eq(links.userId, userId)));

    // Insert new links
    if (detected.length > 0) {
      await db.insert(links).values(
        detected.map((link) => ({
          userId,
          urlId,
          originalUrl: link.href,
          anchorText: link.anchorText || null,
          isAffiliate: link.isAffiliate,
          networkName: link.networkName,
          status: "unchecked" as const,
        }))
      );
    }

    // Health-check affiliate links only (saves time)
    const affiliateUrls = detected
      .filter((l) => l.isAffiliate)
      .map((l) => l.href);

    let brokenCount = 0;
    let checkResults: Awaited<ReturnType<typeof checkLinks>> = [];
    if (affiliateUrls.length > 0) {
      checkResults = await checkLinks(affiliateUrls, 5);

      // Update link statuses
      for (const result of checkResults) {
        await db
          .update(links)
          .set({
            status: result.status,
            httpStatusCode: result.httpStatusCode,
            resolvedUrl: result.resolvedUrl,
            lastCheckedAt: new Date(),
          })
          .where(
            and(
              eq(links.originalUrl, result.url),
              eq(links.urlId, urlId),
              eq(links.userId, userId)
            )
          );
        if (result.status === "broken") brokenCount++;
      }
    }

    const affiliateCount = detected.filter((l) => l.isAffiliate).length;

    // Update scan
    await db
      .update(scans)
      .set({
        status: "completed",
        totalLinksFound: detected.length,
        affiliateLinksFound: affiliateCount,
        brokenLinksFound: brokenCount,
        completedAt: new Date(),
      })
      .where(eq(scans.id, scan.id));

    // Update URL stats
    await db
      .update(urls)
      .set({
        totalLinks: affiliateCount,
        brokenLinks: brokenCount,
        lastScannedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(urls.id, urlId));

    // Send broken links email alert
    if (brokenCount > 0) {
      try {
        const [userData] = await db
          .select({ email: userTable.email })
          .from(userTable)
          .where(eq(userTable.id, userId));

        if (userData?.email) {
          const brokenDetails = checkResults
            .filter((r) => r.status === "broken")
            .map((r) => {
              const link = detected.find((l) => l.href === r.url);
              return {
                url: r.url,
                network: link?.networkName || null,
                httpStatus: r.httpStatusCode,
              };
            });

          await sendBrokenLinksAlert(
            userData.email,
            brokenDetails,
            title || urlRecord.url,
            urlRecord.url
          );
        }
      } catch {
        // Email alert is best-effort, don't fail the scan
      }
    }
  } catch (error) {
    await db
      .update(scans)
      .set({
        status: "failed",
        errorMessage:
          error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
      })
      .where(eq(scans.id, scan.id));
  }
}
