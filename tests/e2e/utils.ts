import { Page, Locator, expect } from "@playwright/test";

/**
 * Common test utilities for Playwright E2E tests
 */

/**
 * Wait for an element to be visible and return it
 */
export async function waitForElement(
  page: Page,
  selector: string,
): Promise<Locator> {
  const element = page.locator(selector);
  await expect(element).toBeVisible();
  return element;
}

/**
 * Wait for page to load completely
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle");
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
export async function fillField(
  page: Page,
  selector: string,
  value: string,
): Promise<void> {
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
  options?: { waitForNavigation?: boolean },
): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toBeVisible();

  if (options?.waitForNavigation) {
    await Promise.all([page.waitForNavigation(), element.click()]);
  } else {
    await element.click();
  }
}

/**
 * Wait for API response
 */
export async function waitForApiResponse(
  page: Page,
  urlPattern: string | RegExp,
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
  status: number = 200,
): Promise<void> {
  await page.route(url, (route) => {
    route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });
}

/**
 * Check if element has specific text
 */
export async function expectElementToHaveText(
  page: Page,
  selector: string,
  text: string | RegExp,
): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toHaveText(text);
}

/**
 * Check if element is hidden
 */
export async function expectElementToBeHidden(
  page: Page,
  selector: string,
): Promise<void> {
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
  value: string,
): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toHaveAttribute(attribute, value);
}

/**
 * Scroll element into view
 */
export async function scrollIntoView(
  page: Page,
  selector: string,
): Promise<void> {
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
export async function expectUrlToMatch(
  page: Page,
  pattern: string | RegExp,
): Promise<void> {
  await expect(page).toHaveURL(pattern);
}

/**
 * Wait for specific number of elements
 */
export async function waitForElementCount(
  page: Page,
  selector: string,
  count: number,
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
  filePath: string,
): Promise<void> {
  const fileInput = page.locator(fileInputSelector);
  await fileInput.setInputFiles(filePath);
}

/**
 * Helper to handle downloads
 */
export async function handleDownload(
  page: Page,
  triggerSelector: string,
): Promise<string> {
  const downloadPromise = page.waitForEvent("download");
  await page.locator(triggerSelector).click();
  const download = await downloadPromise;
  return download.suggestedFilename();
}

/**
 * Wait for a chat message to appear in the conversation
 */
export async function waitForChatMessage(
  page: Page,
  messageText: string,
  timeout: number = 10000,
): Promise<void> {
  await page.waitForSelector(`text=${messageText}`, { timeout });
}

/**
 * Send a message in an ongoing chat conversation
 */
export async function sendChatMessage(
  page: Page,
  message: string,
): Promise<void> {
  const messageInput = page.locator("textarea").last();
  const sendButton = page.locator('button:has-text("Send")').last();

  await messageInput.fill(message);
  await sendButton.click();
  await expect(messageInput).toHaveValue("");
}

/**
 * Get the conversation ID from the current URL
 */
export async function getConversationIdFromUrl(
  page: Page,
): Promise<string | null> {
  const url = page.url();
  const match = url.match(/\/chat\/view\/([a-f0-9-]{36})$/);
  return match ? match[1] : null;
}

/**
 * Wait for the chat interface to be fully loaded
 */
export async function waitForChatInterface(page: Page): Promise<void> {
  await waitForElement(page, "textarea");
  await waitForElement(page, 'button:has-text("Send")');
  await waitForPageLoad(page);
}

/**
 * Check if a conversation ID is valid UUID format
 */
export function isValidConversationId(id: string): boolean {
  const uuidRegex =
    /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
  return uuidRegex.test(id);
}

/**
 * Navigate to a specific conversation
 */
export async function navigateToConversation(
  page: Page,
  conversationId: string,
): Promise<void> {
  await page.goto(`/chat/view/${conversationId}`);
  await waitForChatInterface(page);
}

/**
 * Start a new chat conversation with a message
 */
export async function startNewChat(
  page: Page,
  initialMessage: string,
): Promise<string> {
  await page.goto("/chat/new");
  await waitForPageLoad(page);

  await fillField(page, 'textarea[name="message"]', initialMessage);
  await page.locator('button[type="submit"]').click();

  await page.waitForURL(/\/chat\/view\/[a-f0-9-]{36}$/);
  const conversationId = await getConversationIdFromUrl(page);

  if (!conversationId) {
    throw new Error("Failed to create new conversation");
  }

  return conversationId;
}

/**
 * Wait for loading indicators to disappear
 */
export async function waitForLoadingToComplete(page: Page): Promise<void> {
  await page.waitForSelector(".animate-spin, .loading", {
    state: "hidden",
    timeout: 10000,
  });
}

/**
 * Check if send button is in loading state
 */
export async function isSendButtonLoading(page: Page): Promise<boolean> {
  const sendButton = page.locator('button:has-text("Send")').last();
  const isDisabled = await sendButton.isDisabled();
  const hasSpinner = await page
    .locator('button:has-text("Send") .animate-spin')
    .isVisible()
    .catch(() => false);
  return isDisabled || hasSpinner;
}
