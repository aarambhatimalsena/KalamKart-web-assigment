import { test, expect } from '@playwright/test';

test('Navbar should navigate correctly', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Home link
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page).toHaveURL('http://localhost:5173/');

  // Products link
  await page.getByRole('link', { name: 'Products', exact: true }).click();
  await expect(page).toHaveURL(/\/products/);

  // Pages link (this is your actual route)
  const pagesLink = page.getByRole('link', { name: /pages/i });
  if (await pagesLink.count()) {
    await pagesLink.click();
    await expect(page).toHaveURL(/\/pages/);
  }
});
