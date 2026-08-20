import { expect, test } from "@playwright/test";

test("demo remains readable in a dark OS color scheme", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await page.getByRole("button", { name: /try the guest demo/i }).click();
  await expect(page.getByRole("heading", { name: /lost something/i })).toBeVisible();
  await page.screenshot({ path: "screenshots/demo-guest-desktop.png", fullPage: true });
  await page.getByRole("button", { name: /resort management/i }).click();
  await expect(page.getByRole("heading", { name: /command center/i })).toBeVisible();
  await page.screenshot({ path: "screenshots/demo-management-desktop.png", fullPage: true });
  await page.getByRole("button", { name: /found inventory/i }).click();
  await page.screenshot({ path: "screenshots/demo-inventory-desktop.png", fullPage: true });
  await page.getByRole("button", { name: /custody log/i }).click();
  await page.screenshot({ path: "screenshots/demo-custody-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: /found inventory/i }).click();
  await page.screenshot({ path: "screenshots/demo-inventory-mobile.png", fullPage: true });
  expect(consoleErrors).toEqual([]);
});
