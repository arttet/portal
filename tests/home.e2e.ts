import { expect, test } from "@playwright/test";

test("renders the portal start page", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Portal");
  await expect(page.getByRole("heading", { name: "Portal" })).toBeVisible();
});
