import { test, expect } from '@playwright/test';

test('Homepage should load and display core elements', async ({ page }) => {
  await page.goto('/');

  // Check main title or logo
  await expect(page.getByRole('heading', { name: /kalamkart/i })).toBeVisible();

  // Check CTA button
  await expect(page.getByRole('button', { name: /shop now/i })).toBeVisible();

  // Navbar links
  await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
  // Optional login check if you're sure it should be there
  // await expect(page.getByRole('link', { name: /login/i })).toBeVisible();

  // Footer visibility
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator('footer')).toBeVisible();
});
