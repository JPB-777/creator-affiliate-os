import { describe, it, expect } from "vitest";
import { generateDisclosure, CONTENT_TYPES } from "@/lib/disclosures";

describe("generateDisclosure", () => {
  it("generates blog disclosure with specific networks", () => {
    const result = generateDisclosure({
      contentType: "blog",
      networks: ["Amazon Associates", "ShareASale"],
    });
    expect(result).toContain("Amazon Associates, ShareASale");
    expect(result).toContain("affiliate links");
  });

  it("generates youtube disclosure", () => {
    const result = generateDisclosure({
      contentType: "youtube",
      networks: ["Impact"],
    });
    expect(result).toContain("Impact");
    expect(result).toContain("description");
  });

  it("generates social media disclosure with hashtags", () => {
    const result = generateDisclosure({
      contentType: "social",
      networks: ["CJ"],
    });
    expect(result).toContain("#ad");
    expect(result).toContain("#affiliate");
  });

  it("generates email disclosure", () => {
    const result = generateDisclosure({
      contentType: "email",
      networks: ["Awin"],
    });
    expect(result).toContain("email");
    expect(result).toContain("Awin");
  });

  it("generates podcast disclosure", () => {
    const result = generateDisclosure({
      contentType: "podcast",
      networks: ["ClickBank"],
    });
    expect(result).toContain("episode");
    expect(result).toContain("ClickBank");
  });

  it("uses fallback text when no networks specified", () => {
    const result = generateDisclosure({
      contentType: "blog",
      networks: [],
    });
    expect(result).toContain("various affiliate programs");
  });

  it("has all 5 content types defined", () => {
    expect(CONTENT_TYPES).toHaveLength(5);
    const values = CONTENT_TYPES.map((t) => t.value);
    expect(values).toContain("blog");
    expect(values).toContain("youtube");
    expect(values).toContain("social");
    expect(values).toContain("email");
    expect(values).toContain("podcast");
  });
});
