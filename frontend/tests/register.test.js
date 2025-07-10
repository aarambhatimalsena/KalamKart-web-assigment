import { test, expect } from '@playwright/test';

test.describe('Register Page UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/register');
  });

  test('should display register form elements and allow input', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible();

    const nameInput = page.getByPlaceholder(/name/i);
    await expect(nameInput).toBeVisible();
    await nameInput.fill('Test User');

    const emailInput = page.getByPlaceholder(/email/i);
    await expect(emailInput).toBeVisible();
    await emailInput.fill('testuser@example.com');

    const passwordInput = page.locator('input[placeholder="Password"]');
    await expect(passwordInput.first()).toBeVisible();
    await passwordInput.first().fill('Password123');

    const confirmPasswordInput = page.locator('input[placeholder="Confirm Password"]');
    await expect(confirmPasswordInput).toBeVisible();
    await confirmPasswordInput.fill('Password123');

    const checkbox = page.locator('input[type="checkbox"]');
    await expect(checkbox).toBeVisible();
    await checkbox.check();

    // Match "Sign up" exactly to avoid Register with OTP etc.
    const registerButton = page.getByRole('button', { name: 'Sign up', exact: true });
    await expect(registerButton).toBeVisible();

    await expect(page.getByRole('link', { name: /login/i })).toBeVisible();
  });
});
