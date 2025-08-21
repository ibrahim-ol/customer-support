import { Page, Locator, expect } from '@playwright/test';

/**
 * Common test utilities for Playwright E2E tests
 */

/**
 * Wait for an element to be visible and return it
 */
export async function waitForElement(page: Page, selector: string): Promise<Locator> {
  const element = page.locator(selector);
  await expect(element).toBeVisible();
  return element;
}

/**
 * Wait for page to load completely
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
}

/**
 * Take a screenshot with a custom name
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({ path: `test-results/screenshots/${name}.png` });
}

/**
 * Fill form field and wait for it to be filled
 */
export async function fillField(page: Page, selector: string, value: string): Promise<void> {
  const field = page.locator(selector);
  await field.fill(value);
  await expect(field).toHaveValue(value);
}

/**
 * Click element and wait for navigation if expected
 */
export async function clickAndWait(
  page: Page,
  selector: string,
  options?: { waitForNavigation?: boolean }
): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toBeVisible();

  if (options?.waitForNavigation) {
    await Promise.all([
      page.waitForNavigation(),
      element.click()
    ]);
  } else {
    await element.click();
  }
}

/**
 * Wait for API response
 */
export async function waitForApiResponse(
  page: Page,
  urlPattern: string | RegExp
): Promise<any> {
  const response = await page.waitForResponse(urlPattern);
  return response.json();
}

/**
 * Mock API response
 */
export async function mockApiResponse(
  page: Page,
  url: string | RegExp,
  response: any,
  status: number = 200
): Promise<void> {
  await page.route(url, route => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response)
    });
  });
}

/**
 * Check if element has specific text
 */
export async function expectElementToHaveText(
  page: Page,
  selector: string,
  text: string | RegExp
): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toHaveText(text);
}

/**
 * Check if element is hidden
 */
export async function expectElementToBeHidden(page: Page, selector: string): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toBeHidden();
}

/**
 * Wait for element to have specific attribute value
 */
export async function waitForAttribute(
  page: Page,
  selector: string,
  attribute: string,
  value: string
): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toHaveAttribute(attribute, value);
}

/**
 * Scroll element into view
 */
export async function scrollIntoView(page: Page, selector: string): Promise<void> {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

/**
 * Get current URL
 */
export async function getCurrentUrl(page: Page): Promise<string> {
  return page.url();
}

/**
 * Check if current URL matches pattern
 */
export async function expectUrlToMatch(page: Page, pattern: string | RegExp): Promise<void> {
  await expect(page).toHaveURL(pattern);
}

/**
 * Wait for specific number of elements
 */
export async function waitForElementCount(
  page: Page,
  selector: string,
  count: number
): Promise<void> {
  const elements = page.locator(selector);
  await expect(elements).toHaveCount(count);
}

/**
 * Helper to handle file uploads
 */
export async function uploadFile(
  page: Page,
  fileInputSelector: string,
  filePath: string
): Promise<void> {
  const fileInput = page.locator(fileInputSelector);
  await fileInput.setInputFiles(filePath);
}

/**
 * Helper to handle downloads
 */
export async function handleDownload(
  page: Page,
  triggerSelector: string
): Promise<string> {
  const downloadPromise = page.waitForEvent('download');
  await page.locator(triggerSelector).click();
  const download = await downloadPromise;
  return download.suggestedFilename();
}
