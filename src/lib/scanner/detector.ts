import { AFFILIATE_NETWORKS } from "./networks";
import type { ExtractedLink } from "./parser";

export interface DetectedLink extends ExtractedLink {
  isAffiliate: boolean;
  networkName: string | null;
}

export function detectAffiliateLinks(
  extractedLinks: ExtractedLink[]
): DetectedLink[] {
  return extractedLinks.map((link) => {
    for (const network of AFFILIATE_NETWORKS) {
      for (const pattern of network.patterns) {
        if (pattern.test(link.href)) {
          return {
            ...link,
            isAffiliate: true,
            networkName: network.name,
          };
        }
      }
    }
    return {
      ...link,
      isAffiliate: false,
      networkName: null,
    };
  });
}
