import { test, expect } from '@playwright/test';

test('Product page should load and display products', async ({ page }) => {
  await page.goto('http://localhost:5173/products'); // adjust if route differs

  // Confirm "Products" heading
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();

  // Check that product card appears
  const firstProductCard = page.locator('a.group').first();
  await expect(firstProductCard).toBeVisible();

  // Image with alt (product.name)
  await expect(firstProductCard.locator('img[alt]')).toBeVisible();

  // Price inside card
  await expect(firstProductCard).toContainText('Rs.');
});
