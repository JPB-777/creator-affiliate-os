import * as cheerio from "cheerio";

export interface ExtractedLink {
  href: string;
  anchorText: string;
}

export function extractLinks(html: string, baseUrl: string): ExtractedLink[] {
  const $ = cheerio.load(html);
  const links: ExtractedLink[] = [];
  const seen = new Set<string>();

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    if (!href) return;

    let absoluteUrl: string;
    try {
      absoluteUrl = new URL(href, baseUrl).toString();
    } catch {
      return;
    }

    if (
      absoluteUrl.startsWith("mailto:") ||
      absoluteUrl.startsWith("javascript:") ||
      absoluteUrl.startsWith("#")
    )
      return;

    if (seen.has(absoluteUrl)) return;
    seen.add(absoluteUrl);

    links.push({
      href: absoluteUrl,
      anchorText: $(element).text().trim().substring(0, 200),
    });
  });

  return links;
}

export function extractTitle(html: string): string | null {
  const $ = cheerio.load(html);
  return $("title").text().trim() || $("h1").first().text().trim() || null;
}
