import * as cheerio from "cheerio";

interface SitemapEntry {
  url: string;
  lastmod?: string;
}

export async function fetchSitemap(sitemapUrl: string): Promise<SitemapEntry[]> {
  const response = await fetch(sitemapUrl, {
    headers: { "User-Agent": "AffiliateOS/1.0 Sitemap Parser" },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap: ${response.status}`);
  }

  const xml = await response.text();
  return parseSitemapXml(xml, sitemapUrl);
}

async function parseSitemapXml(
  xml: string,
  sourceUrl: string,
  depth: number = 0
): Promise<SitemapEntry[]> {
  if (depth > 2) return []; // Max 2 levels of sitemap index nesting

  const $ = cheerio.load(xml, { xmlMode: true });
  const entries: SitemapEntry[] = [];

  // Check if this is a sitemap index
  const sitemapIndexEntries = $("sitemapindex sitemap loc");
  if (sitemapIndexEntries.length > 0) {
    const childUrls: string[] = [];
    sitemapIndexEntries.each((_, el) => {
      childUrls.push($(el).text().trim());
    });

    // Limit child sitemaps
    const limitedUrls = childUrls.slice(0, 5);

    for (const childUrl of limitedUrls) {
      try {
        const childEntries = await fetchAndParseSitemap(childUrl, depth + 1);
        entries.push(...childEntries);
        if (entries.length >= 200) break;
      } catch {
        // Skip failed child sitemaps
      }
    }

    return entries.slice(0, 200);
  }

  // Regular sitemap
  $("urlset url").each((_, el) => {
    const loc = $(el).find("loc").text().trim();
    const lastmod = $(el).find("lastmod").text().trim() || undefined;
    if (loc) {
      entries.push({ url: loc, lastmod });
    }
  });

  return entries.slice(0, 200);
}

async function fetchAndParseSitemap(
  url: string,
  depth: number
): Promise<SitemapEntry[]> {
  const response = await fetch(url, {
    headers: { "User-Agent": "AffiliateOS/1.0 Sitemap Parser" },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) return [];

  const xml = await response.text();
  return parseSitemapXml(xml, url, depth);
}
