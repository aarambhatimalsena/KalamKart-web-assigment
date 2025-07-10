import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
  test('should display key product information', async ({ page }) => {
    await page.goto('http://localhost:5173/product/6858fc50014170086f8b30ab');

    // Check for product name
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible();

    // Check for price
    await expect(page.locator('text=Rs.')).toBeVisible();

    // Precise: image inside product container
    const productImage = page.locator('img[alt="Apsara Pencil"]'); // or use the actual product name
    await expect(productImage).toBeVisible();

    // Quantity section
    await expect(page.locator('text=Quantity')).toBeVisible();

    // Buttons
    await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /buy it now/i })).toBeVisible();

    // Review section
    await expect(page.locator('text=Customer Reviews')).toBeVisible();
  });
});
