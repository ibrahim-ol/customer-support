import { test, expect } from '@playwright/test';

test.describe('Example Tests', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');

    // Basic check that the page loaded
    await expect(page).toHaveURL(/.*localhost:3000/);

    // Check that the page has a title
    await expect(page).toHaveTitle(/.+/);
  });

  test('should have basic page structure', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to be loaded
    await page.waitForLoadState('networkidle');

    // Check that we can find some basic HTML structure
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
