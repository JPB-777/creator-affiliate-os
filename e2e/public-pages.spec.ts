import { test, expect } from "@playwright/test";

test.describe("Public Pages", () => {
  test("landing page loads and shows hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page).toHaveTitle(/AffiliateOS/i);
  });

  test("landing page has sign-up CTA", async ({ page }) => {
    await page.goto("/");
    const signUpLink = page.locator('a[href="/sign-up"]').first();
    await expect(signUpLink).toBeVisible();
  });

  test("pricing page loads", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.locator("text=Self-Hosted")).toBeVisible();
    await expect(page.locator("text=Cloud Free")).toBeVisible();
  });

  test("blog page loads", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("sign-in page loads", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("sign-up page loads", async ({ page }) => {
    await page.goto("/sign-up");
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});

test.describe("Auth Protection", () => {
  test("dashboard redirects to sign-in when not authenticated", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/sign-in/);
    expect(page.url()).toContain("/sign-in");
  });

  test("urls page redirects to sign-in when not authenticated", async ({ page }) => {
    await page.goto("/urls");
    await page.waitForURL(/sign-in/);
    expect(page.url()).toContain("/sign-in");
  });

  test("settings page redirects to sign-in when not authenticated", async ({ page }) => {
    await page.goto("/settings");
    await page.waitForURL(/sign-in/);
    expect(page.url()).toContain("/sign-in");
  });
});

test.describe("API Endpoints", () => {
  test("health endpoint returns 200", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBeDefined();
  });

  test("API v1 returns 401 without auth", async ({ request }) => {
    const response = await request.get("/api/v1/urls");
    expect(response.status()).toBe(401);
  });
});
