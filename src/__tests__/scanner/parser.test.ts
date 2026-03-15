import { describe, it, expect } from "vitest";
import { extractLinks, extractTitle } from "@/lib/scanner/parser";

describe("extractLinks", () => {
  it("extracts absolute links from HTML", () => {
    const html = `<a href="https://example.com/page">Link</a>`;
    const links = extractLinks(html, "https://base.com");
    expect(links).toHaveLength(1);
    expect(links[0].href).toBe("https://example.com/page");
    expect(links[0].anchorText).toBe("Link");
  });

  it("resolves relative links against base URL", () => {
    const html = `<a href="/about">About</a>`;
    const links = extractLinks(html, "https://example.com");
    expect(links[0].href).toBe("https://example.com/about");
  });

  it("deduplicates links by URL", () => {
    const html = `
      <a href="https://example.com">Link 1</a>
      <a href="https://example.com">Link 2</a>
    `;
    const links = extractLinks(html, "https://base.com");
    expect(links).toHaveLength(1);
  });

  it("skips mailto and javascript links", () => {
    const html = `
      <a href="mailto:test@test.com">Email</a>
      <a href="javascript:void(0)">Click</a>
      <a href="https://example.com">Real</a>
    `;
    const links = extractLinks(html, "https://base.com");
    expect(links).toHaveLength(1);
    expect(links[0].href).toBe("https://example.com/");
  });

  it("skips elements without href", () => {
    const html = `<a>No href</a><a href="">Empty</a>`;
    const links = extractLinks(html, "https://base.com");
    expect(links.length).toBeLessThanOrEqual(1);
  });

  it("truncates anchor text to 200 characters", () => {
    const longText = "A".repeat(300);
    const html = `<a href="https://example.com">${longText}</a>`;
    const links = extractLinks(html, "https://base.com");
    expect(links[0].anchorText.length).toBe(200);
  });

  it("handles empty HTML", () => {
    const links = extractLinks("", "https://base.com");
    expect(links).toEqual([]);
  });
});

describe("extractTitle", () => {
  it("extracts title from title tag", () => {
    const html = `<html><head><title>My Page</title></head></html>`;
    expect(extractTitle(html)).toBe("My Page");
  });

  it("falls back to h1 if no title", () => {
    const html = `<html><body><h1>Heading</h1></body></html>`;
    expect(extractTitle(html)).toBe("Heading");
  });

  it("returns null for empty page", () => {
    expect(extractTitle("<html><body></body></html>")).toBeNull();
  });
});
