export interface NetworkPattern {
  name: string;
  slug: string;
  patterns: RegExp[];
}

export const AFFILIATE_NETWORKS: NetworkPattern[] = [
  {
    name: "Amazon Associates",
    slug: "amazon-associates",
    patterns: [
      /amazon\.[a-z.]+\/.*[?&]tag=/i,
      /amzn\.to\//i,
      /amazon\.[a-z.]+\/dp\//i,
      /amazon\.[a-z.]+\/gp\/product\//i,
    ],
  },
  {
    name: "ShareASale",
    slug: "shareasale",
    patterns: [/shareasale\.com\/[ur]\./i, /shareasale\.com\/r\.cfm/i],
  },
  {
    name: "Commission Junction (CJ)",
    slug: "cj-affiliate",
    patterns: [
      /jdoqocy\.com/i,
      /tkqlhce\.com/i,
      /dpbolvw\.net/i,
      /anrdoezrs\.net/i,
      /kqzyfj\.com/i,
    ],
  },
  {
    name: "Impact",
    slug: "impact",
    patterns: [/sjv\.io/i, /ojrq\.net/i, /impact\.com/i, /evyy\.net/i],
  },
  {
    name: "Rakuten Advertising",
    slug: "rakuten",
    patterns: [/click\.linksynergy\.com/i],
  },
  {
    name: "Awin",
    slug: "awin",
    patterns: [/awin1\.com/i, /zenaps\.com/i],
  },
  {
    name: "ClickBank",
    slug: "clickbank",
    patterns: [/[a-z0-9]+\.hop\.clickbank\.net/i],
  },
  {
    name: "Partnerize",
    slug: "partnerize",
    patterns: [/prf\.hn/i, /partnerize\.com/i],
  },
  {
    name: "FlexOffers",
    slug: "flexoffers",
    patterns: [/flexoffers\.com/i],
  },
  {
    name: "Skimlinks",
    slug: "skimlinks",
    patterns: [/go\.skimresources\.com/i, /go\.redirectingat\.com/i],
  },
  {
    name: "Unknown Affiliate",
    slug: "unknown",
    patterns: [
      /[?&](ref|affiliate|aff|partner)=/i,
      /[?&]utm_medium=affiliate/i,
    ],
  },
];
