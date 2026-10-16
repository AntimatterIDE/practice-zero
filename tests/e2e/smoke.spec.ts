import { expect, test } from "@playwright/test";

test("homepage sells the software and links into the demo", async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem("pz-intro-v2", "1");
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "less administration. more care." })).toBeVisible();
  await page.getByRole("link", { name: "Open Paul Wallace" }).click();
  await expect(page).toHaveURL(/\/try\/patients\/pt-hale/);
  await expect(page.getByText("Paul Wallace").first()).toBeVisible();
});

test("missing pages use the custom 404", async ({ page }) => {
  await page.goto("/this-page-does-not-exist");
  await expect(page.getByRole("heading", { name: /Nothing on the scope/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back home" })).toBeVisible();
});
