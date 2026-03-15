import { db } from "@/lib/db";
import { scans, links, urls, linkStatusHistory, opportunities, contentSnapshots, contentDrifts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { fetchPage } from "@/lib/scanner/fetcher";
import { extractLinks, extractTitle } from "@/lib/scanner/parser";
import { detectAffiliateLinks } from "@/lib/scanner/detector";
import { detectOpportunities } from "@/lib/scanner/opportunity-detector";
import { extractLinkContexts } from "@/lib/scanner/content-snapshot";
import { checkLinks } from "@/lib/scanner/checker";
import { sendBrokenLinksAlert } from "@/lib/email";
import { user as userTable } from "@/lib/db/schema";
import { createNotification } from "@/server/actions/notifications";

export async function executeScan(scanId: string, urlId: string, userId: string) {
  try {
    // Mark as scanning
    await db.update(scans).set({ status: "scanning" }).where(eq(scans.id, scanId));

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

    // Health-check affiliate links only
    const affiliateUrls = detected
      .filter((l) => l.isAffiliate)
      .map((l) => l.href);

    let brokenCount = 0;
    let checkResults: Awaited<ReturnType<typeof checkLinks>> = [];
    if (affiliateUrls.length > 0) {
      checkResults = await checkLinks(affiliateUrls, 5);

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

    // Record link status history
    if (checkResults.length > 0) {
      await db.insert(linkStatusHistory).values(
        checkResults.map((r) => {
          const link = detected.find((l) => l.href === r.url);
          return {
            userId,
            urlId,
            linkOriginalUrl: r.url,
            networkName: link?.networkName || null,
            status: r.status as "healthy" | "broken" | "redirect" | "timeout" | "unchecked",
            httpStatusCode: r.httpStatusCode,
            checkedAt: new Date(),
          };
        })
      );
    }

    // Detect monetization opportunities
    try {
      const oppMatches = detectOpportunities(detected);
      if (oppMatches.length > 0) {
        await db.delete(opportunities).where(and(eq(opportunities.urlId, urlId), eq(opportunities.userId, userId)));
        await db.insert(opportunities).values(
          oppMatches.map((m) => ({
            userId,
            urlId,
            linkOriginalUrl: m.linkUrl,
            anchorText: m.anchorText,
            suggestedNetwork: m.suggestedNetwork,
            reason: m.reason,
          }))
        );
      }
    } catch {
      // Best-effort
    }

    // Content drift detection
    try {
      const affiliateHrefs = detected.filter((l) => l.isAffiliate).map((l) => l.href);
      const contexts = extractLinkContexts(html, affiliateHrefs);

      if (contexts.length > 0) {
        const existingSnapshots = await db
          .select()
          .from(contentSnapshots)
          .where(and(eq(contentSnapshots.urlId, urlId), eq(contentSnapshots.userId, userId)));

        const snapshotMap = new Map(existingSnapshots.map((s) => [s.linkOriginalUrl, s]));

        for (const ctx of contexts) {
          const existing = snapshotMap.get(ctx.linkUrl);
          if (existing && existing.contextHash !== ctx.contextHash) {
            await db.insert(contentDrifts).values({
              userId,
              urlId,
              linkOriginalUrl: ctx.linkUrl,
              previousSnippet: existing.contextSnippet,
              currentSnippet: ctx.contextSnippet,
              previousHash: existing.contextHash,
              currentHash: ctx.contextHash,
            });
          }
        }

        await db.delete(contentSnapshots).where(and(eq(contentSnapshots.urlId, urlId), eq(contentSnapshots.userId, userId)));
        await db.insert(contentSnapshots).values(
          contexts.map((ctx) => ({
            userId,
            urlId,
            linkOriginalUrl: ctx.linkUrl,
            contextHash: ctx.contextHash,
            contextSnippet: ctx.contextSnippet,
          }))
        );
      }
    } catch {
      // Best-effort
    }

    const affiliateCount = detected.filter((l) => l.isAffiliate).length;

    // Update scan record
    await db
      .update(scans)
      .set({
        status: "completed",
        totalLinksFound: detected.length,
        affiliateLinksFound: affiliateCount,
        brokenLinksFound: brokenCount,
        completedAt: new Date(),
      })
      .where(eq(scans.id, scanId));

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

    // Send broken links email + notification
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
        // Best-effort
      }

      await createNotification({
        userId,
        type: "broken_link",
        title: `${brokenCount} broken link${brokenCount > 1 ? "s" : ""} found`,
        message: `Scan of "${title || urlRecord.url}" found ${brokenCount} broken affiliate link${brokenCount > 1 ? "s" : ""}.`,
        actionUrl: `/urls/${urlId}`,
      });
    } else {
      const affiliateMsg = affiliateCount !== 1 ? "s" : "";
      await createNotification({
        userId,
        type: "scan_complete",
        title: "Scan completed",
        message: `"${title || urlRecord.url}" scanned — ${affiliateCount} affiliate link${affiliateMsg} found, all healthy.`,
        actionUrl: `/urls/${urlId}`,
      });
    }
  } catch (error) {
    await db
      .update(scans)
      .set({
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
      })
      .where(eq(scans.id, scanId));
  } finally {
    // Release URL scan lock
    await db
      .update(urls)
      .set({ scanningLockedAt: null })
      .where(eq(urls.id, urlId));
  }
}
