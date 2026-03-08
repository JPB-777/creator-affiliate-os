import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { affiliateNetworks } from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const networks = [
  {
    name: "Amazon Associates",
    slug: "amazon-associates",
    domain: "amazon.com",
    patterns: [
      "amazon\\.[a-z.]+/.*[?&]tag=",
      "amzn\\.to/",
      "amazon\\.[a-z.]+/dp/",
      "amazon\\.[a-z.]+/gp/product/",
    ],
  },
  {
    name: "ShareASale",
    slug: "shareasale",
    domain: "shareasale.com",
    patterns: ["shareasale\\.com/[ur]\\.", "shareasale\\.com/r\\.cfm"],
  },
  {
    name: "Commission Junction (CJ)",
    slug: "cj-affiliate",
    domain: "cj.com",
    patterns: [
      "jdoqocy\\.com",
      "tkqlhce\\.com",
      "dpbolvw\\.net",
      "anrdoezrs\\.net",
      "kqzyfj\\.com",
    ],
  },
  {
    name: "Impact",
    slug: "impact",
    domain: "impact.com",
    patterns: ["sjv\\.io", "ojrq\\.net", "impact\\.com", "evyy\\.net"],
  },
  {
    name: "Rakuten Advertising",
    slug: "rakuten",
    domain: "rakutenadvertising.com",
    patterns: ["click\\.linksynergy\\.com", "rakuten\\.com.*[?&]mid="],
  },
  {
    name: "Awin",
    slug: "awin",
    domain: "awin.com",
    patterns: ["awin1\\.com", "zenaps\\.com"],
  },
  {
    name: "ClickBank",
    slug: "clickbank",
    domain: "clickbank.com",
    patterns: ["[a-z0-9]+\\.hop\\.clickbank\\.net", "clickbank\\.net"],
  },
  {
    name: "Partnerize",
    slug: "partnerize",
    domain: "partnerize.com",
    patterns: ["prf\\.hn", "partnerize\\.com"],
  },
  {
    name: "FlexOffers",
    slug: "flexoffers",
    domain: "flexoffers.com",
    patterns: ["flexoffers\\.com", "track\\.flexlinkspro\\.com"],
  },
  {
    name: "Skimlinks",
    slug: "skimlinks",
    domain: "skimlinks.com",
    patterns: ["go\\.skimresources\\.com", "go\\.redirectingat\\.com"],
  },
];

async function seed() {
  console.log("Seeding affiliate networks...");
  for (const network of networks) {
    await db
      .insert(affiliateNetworks)
      .values(network)
      .onConflictDoNothing({ target: affiliateNetworks.slug });
  }
  console.log(`Seeded ${networks.length} affiliate networks.`);
}

seed().catch(console.error);
