import { test, expect } from "@playwright/test";

test("jobs filter does not call the network", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (req) => requests.push(req.url()));
  await page.goto("/savanna/pages/jobs.html");
  await page.locator("#filter-options input").first().check();
  await expect(page.locator("#filter-status")).toContainText(/match|shown/i);
  const afterFilter = requests.filter((u) => u.includes("/api"));
  expect(afterFilter.length).toBe(0);
});

test("apply button opens dialog", async ({ page }) => {
  await page.goto("/savanna/pages/jobs.html");
  await page.locator("[data-apply]").first().click();
  await expect(page.locator("#apply-dialog")).toBeVisible();
});