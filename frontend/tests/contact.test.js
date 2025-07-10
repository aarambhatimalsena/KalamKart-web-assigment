import { test, expect } from '@playwright/test';

test('Contact Page UI Render Test', async ({ page }) => {
  await page.goto('http://localhost:5173/contact');

  // Heading should be visible
  await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();

  // Map iframe exists
  await expect(page.locator('iframe')).toBeVisible();

  // Breadcrumb "Home" link (second 'Home')
  await expect(page.getByRole('link', { name: 'Home' }).nth(1)).toBeVisible();

  // Breadcrumb "Contact" text (second match, breadcrumb span)
  await expect(page.getByText('Contact').nth(1)).toBeVisible();
});
