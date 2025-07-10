import { test, expect } from '@playwright/test';

test('Categories dropdown renders with expected options', async ({ page }) => {
  await page.goto('http://localhost:5173/products');

  const categoryDropdown = page.locator('select#sort');
  await expect(categoryDropdown).toBeVisible();

  // Check that option with expected value/text exists (without visibility check)
  await expect(categoryDropdown.locator('option', { hasText: 'Alphabetically, A–Z' })).toHaveCount(1);
  await expect(categoryDropdown.locator('option', { hasText: 'Price: Low to High' })).toHaveCount(1);
});
