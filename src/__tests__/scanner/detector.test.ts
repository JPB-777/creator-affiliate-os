import { describe, it, expect } from "vitest";
import { detectAffiliateLinks } from "@/lib/scanner/detector";
import type { ExtractedLink } from "@/lib/scanner/parser";

function makeLink(href: string): ExtractedLink {
  return { href, anchorText: "test link" };
}

describe("detectAffiliateLinks", () => {
  it("detects Amazon Associates links", () => {
    const links = [
      makeLink("https://amazon.com/dp/B08N5WRWNW?tag=mytag-20"),
      makeLink("https://amzn.to/3xyz123"),
      makeLink("https://amazon.co.uk/gp/product/B08N5WRWNW"),
    ];
    const results = detectAffiliateLinks(links);
    expect(results).toHaveLength(3);
    results.forEach((r) => {
      expect(r.isAffiliate).toBe(true);
      expect(r.networkName).toBe("Amazon Associates");
    });
  });

  it("detects ShareASale links", () => {
    const results = detectAffiliateLinks([
      makeLink("https://shareasale.com/r.cfm?b=123&u=456"),
    ]);
    expect(results[0].isAffiliate).toBe(true);
    expect(results[0].networkName).toBe("ShareASale");
  });

  it("detects CJ links", () => {
    const results = detectAffiliateLinks([
      makeLink("https://www.jdoqocy.com/click-123-456"),
      makeLink("https://www.tkqlhce.com/link"),
    ]);
    results.forEach((r) => {
      expect(r.isAffiliate).toBe(true);
      expect(r.networkName).toBe("Commission Junction (CJ)");
    });
  });

  it("detects Impact links", () => {
    const results = detectAffiliateLinks([
      makeLink("https://some-brand.sjv.io/abc123"),
    ]);
    expect(results[0].isAffiliate).toBe(true);
    expect(results[0].networkName).toBe("Impact");
  });

  it("marks non-affiliate links correctly", () => {
    const results = detectAffiliateLinks([
      makeLink("https://example.com/page"),
      makeLink("https://google.com"),
    ]);
    results.forEach((r) => {
      expect(r.isAffiliate).toBe(false);
      expect(r.networkName).toBeNull();
    });
  });

  it("detects generic affiliate parameters", () => {
    const results = detectAffiliateLinks([
      makeLink("https://example.com/product?ref=affiliate123"),
      makeLink("https://example.com/product?utm_medium=affiliate"),
    ]);
    results.forEach((r) => {
      expect(r.isAffiliate).toBe(true);
      expect(r.networkName).toBe("Unknown Affiliate");
    });
  });

  it("handles empty input", () => {
    const results = detectAffiliateLinks([]);
    expect(results).toEqual([]);
  });

  it("preserves original link data", () => {
    const link = { href: "https://amzn.to/abc", anchorText: "Buy now" };
    const results = detectAffiliateLinks([link]);
    expect(results[0].href).toBe(link.href);
    expect(results[0].anchorText).toBe(link.anchorText);
  });
});
