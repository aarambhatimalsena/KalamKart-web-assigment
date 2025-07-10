import { test, expect } from '@playwright/test';

test('Navbar should show key navigation links (final version)', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: /^home$/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /^products$/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /^pages$/i })).toBeVisible();   
  await expect(page.getByRole('link', { name: /^contact$/i })).toBeVisible();

});
