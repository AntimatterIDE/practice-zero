import { expect, test } from "@playwright/test";

test("homepage sells the software and links into the demo", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "It's not a product. It's the day itself." })).toBeVisible();
  await page.getByRole("link", { name: "Open Jordan Hale" }).click();
  await expect(page).toHaveURL(/\/try\/patients\/pt-hale/);
  await expect(page.getByText("Jordan Hale").first()).toBeVisible();
});

test("missing pages use the custom 404", async ({ page }) => {
  await page.goto("/this-page-does-not-exist");
  await expect(page.getByRole("heading", { name: "This page is not on the site." })).toBeVisible();
});
