import type { DetectedLink } from "./detector";

// Domains that have well-known affiliate programs
const MONETIZABLE_DOMAINS: Record<string, string> = {
  "amazon.com": "Amazon Associates",
  "amazon.co.uk": "Amazon Associates",
  "amazon.ca": "Amazon Associates",
  "amazon.de": "Amazon Associates",
  "ebay.com": "eBay Partner Network",
  "walmart.com": "Walmart Affiliates",
  "target.com": "Target Partners",
  "bestbuy.com": "Best Buy Affiliates",
  "etsy.com": "Etsy Affiliates",
  "wayfair.com": "Wayfair Affiliates",
  "homedepot.com": "Home Depot Affiliates",
  "lowes.com": "Lowe's Affiliates",
  "nike.com": "Nike Affiliates",
  "adidas.com": "Adidas Affiliates",
  "nordstrom.com": "Nordstrom Affiliates",
  "sephora.com": "Sephora Affiliates",
  "ulta.com": "Ulta Affiliates",
  "apple.com": "Apple Services",
  "booking.com": "Booking.com Affiliates",
  "expedia.com": "Expedia Affiliates",
  "aliexpress.com": "AliExpress Affiliates",
  "newegg.com": "Newegg Affiliates",
  "bhphotovideo.com": "B&H Photo Affiliates",
  "zappos.com": "Zappos Affiliates",
  "macys.com": "Macy's Affiliates",
};

export interface OpportunityMatch {
  linkUrl: string;
  anchorText: string | null;
  suggestedNetwork: string;
  reason: string;
}

function extractDomain(url: string): string | null {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return hostname;
  } catch {
    return null;
  }
}

export function detectOpportunities(
  links: DetectedLink[]
): OpportunityMatch[] {
  const nonAffiliate = links.filter((l) => !l.isAffiliate);
  const matches: OpportunityMatch[] = [];
  const seen = new Set<string>();

  for (const link of nonAffiliate) {
    const domain = extractDomain(link.href);
    if (!domain) continue;

    const network = MONETIZABLE_DOMAINS[domain];
    if (!network) continue;

    // Dedup by URL
    if (seen.has(link.href)) continue;
    seen.add(link.href);

    matches.push({
      linkUrl: link.href,
      anchorText: link.anchorText || null,
      suggestedNetwork: network,
      reason: `Link to ${domain} could be monetized via ${network}`,
    });
  }

  return matches;
}
