import { test, expect } from '@playwright/test';

test('Footer should show the Shop link', async ({ page }) => {
  await page.goto('/');

  // Check footer or any section has the Shop link
  await expect(page.getByRole('link', { name: /^shop$/i })).toBeVisible();
});
