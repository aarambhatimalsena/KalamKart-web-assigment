import { test, expect } from '@playwright/test';

test('Login page should render and allow input', async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  // Heading check
  await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();

  // Email input
  const emailInput = page.getByPlaceholder('Email');
  await expect(emailInput).toBeVisible();
  await emailInput.fill('test@example.com');

  // Password input
  const passwordInput = page.getByPlaceholder('Password');
  await expect(passwordInput).toBeVisible();
  await passwordInput.fill('test1234');

  //  Only target the main submit button (not "Sign in with Password" or OTP)
  const loginButton = page.getByRole('button', { name: 'Sign in', exact: true });
  await expect(loginButton).toBeVisible();

  // Don't click to avoid real login
  // await loginButton.click();
});
