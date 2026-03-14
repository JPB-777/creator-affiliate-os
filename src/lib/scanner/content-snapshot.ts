import * as cheerio from "cheerio";
import { createHash } from "crypto";

interface LinkContext {
  linkUrl: string;
  contextSnippet: string;
  contextHash: string;
}

/**
 * Extract context around affiliate links in HTML.
 * For each affiliate URL, finds the nearest parent element text (±200 chars)
 * and creates a SHA-256 hash for comparison.
 */
export function extractLinkContexts(
  html: string,
  affiliateUrls: string[]
): LinkContext[] {
  if (affiliateUrls.length === 0) return [];

  const $ = cheerio.load(html);
  const contexts: LinkContext[] = [];
  const seen = new Set<string>();

  for (const url of affiliateUrls) {
    if (seen.has(url)) continue;
    seen.add(url);

    // Find the anchor tag with this href
    const anchor = $(`a[href="${url}"]`).first();
    if (!anchor.length) continue;

    // Get the parent element's text for context
    const parent = anchor.parent();
    let contextText = parent.text().trim();

    // If parent text is too short, go up one more level
    if (contextText.length < 50) {
      const grandparent = parent.parent();
      if (grandparent.length) {
        contextText = grandparent.text().trim();
      }
    }

    // Trim to ±200 chars around reasonable length
    const snippet = contextText.slice(0, 400).replace(/\s+/g, " ").trim();

    if (snippet.length === 0) continue;

    const hash = createHash("sha256").update(snippet).digest("hex");

    contexts.push({
      linkUrl: url,
      contextSnippet: snippet,
      contextHash: hash,
    });
  }

  return contexts;
}
