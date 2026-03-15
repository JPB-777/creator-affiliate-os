import { describe, it, expect, vi } from "vitest";

// Mock dns module before importing
vi.mock("dns/promises", () => ({
  default: {
    resolve4: vi.fn().mockResolvedValue(["93.184.216.34"]),
    resolve6: vi.fn().mockResolvedValue([]),
  },
}));

import { validateUrl } from "@/lib/scanner/url-validator";

describe("validateUrl", () => {
  it("accepts valid HTTP URLs", async () => {
    const result = await validateUrl("https://example.com/page");
    expect(result.valid).toBe(true);
  });

  it("rejects URLs that are too long", async () => {
    const longUrl = "https://example.com/" + "a".repeat(2048);
    const result = await validateUrl(longUrl);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("too long");
  });

  it("rejects invalid URLs", async () => {
    const result = await validateUrl("not a url");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Invalid URL");
  });

  it("blocks file protocol", async () => {
    const result = await validateUrl("file:///etc/passwd");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Blocked protocol");
  });

  it("blocks ftp protocol", async () => {
    const result = await validateUrl("ftp://example.com/file");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Blocked protocol");
  });

  it("blocks data protocol", async () => {
    const result = await validateUrl("data:text/html,<script>alert(1)</script>");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Blocked protocol");
  });

  it("blocks localhost", async () => {
    const result = await validateUrl("http://localhost:3000");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Blocked hostname");
  });

  it("blocks private IP 127.0.0.1", async () => {
    const result = await validateUrl("http://127.0.0.1");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Private IP");
  });

  it("blocks private IP 10.x.x.x", async () => {
    const result = await validateUrl("http://10.0.0.1");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Private IP");
  });

  it("blocks private IP 192.168.x.x", async () => {
    const result = await validateUrl("http://192.168.1.1");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Private IP");
  });

  it("blocks private IP 172.16.x.x", async () => {
    const result = await validateUrl("http://172.16.0.1");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Private IP");
  });
});
