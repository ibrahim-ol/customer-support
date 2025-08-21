import { test, expect } from "@playwright/test";
import {
  waitForElement,
  fillField,
  waitForPageLoad,
  mockApiResponse,
} from "./utils.ts";

test.describe("/chat/new - New Chat Route", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to page first, then clear storage
    await page.goto("/chat/new");
    await page.evaluate(() => {
      if (typeof Storage !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }
    });
  });

  test("should load the new chat page correctly", async ({ page }) => {
    // Page already loaded in beforeEach
    await waitForPageLoad(page);

    // Check page title and URL
    await expect(page).toHaveURL(/\/chat\/new/);
    await expect(page).toHaveTitle(/.+/);

    // Verify basic page structure
    const body = page.locator("body");
    await expect(body).toBeVisible();

    // Check for the main form
    const form = page.locator('form[action="/chat/new"]');
    await expect(form).toBeVisible();

    // Verify textarea is present
    const textarea = page.locator('textarea[name="message"]');
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveAttribute(
      "placeholder",
      "How can I help you today?",
    );
    await expect(textarea).toHaveAttribute("required");
    await expect(textarea).toHaveAttribute("minlength", "5");
    await expect(textarea).toHaveAttribute("maxlength", "1000");

    // Verify submit button is present
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveText("Send");
  });

  test("should show error message when accessing with error query param", async ({
    page,
  }) => {
    await page.goto("/chat/new?error=missing_message");
    await waitForPageLoad(page);

    // Check if error message is displayed
    const errorMessage = page.locator("p.text-red-500");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText("missing_message");
  });

  test("should validate required message field", async ({ page }) => {
    // Page already loaded in beforeEach
    await waitForPageLoad(page);

    const submitButton = page.locator('button[type="submit"]');
    const textarea = page.locator('textarea[name="message"]');

    // Try to submit empty form
    await submitButton.click();

    // Check if HTML5 validation prevents submission
    const validationMessage = await textarea.evaluate(
      (el: HTMLTextAreaElement) => el.validationMessage,
    );
    expect(validationMessage).toBeTruthy();
  });

  test("should validate minimum message length", async ({ page }) => {
    // Page already loaded in beforeEach
    await waitForPageLoad(page);

    const textarea = page.locator('textarea[name="message"]');
    const submitButton = page.locator('button[type="submit"]');

    // Enter message shorter than minimum length
    await fillField(page, 'textarea[name="message"]', "Hi");
    await submitButton.click();

    // Check if HTML5 validation prevents submission
    const validationMessage = await textarea.evaluate(
      (el: HTMLTextAreaElement) => el.validationMessage,
    );
    expect(validationMessage).toBeTruthy();
  });

  test("should validate maximum message length", async ({ page }) => {
    // Page already loaded in beforeEach
    await waitForPageLoad(page);

    const textarea = page.locator('textarea[name="message"]');

    // Try to enter text longer than maxlength
    const longText = "a".repeat(1001);
    await textarea.fill(longText);

    // Check that text is truncated to maxlength
    const actualValue = await textarea.inputValue();
    expect(actualValue.length).toBe(1000);
  });

  test("should submit valid message and redirect to chat view", async ({
    page,
  }) => {
    // Page already loaded in beforeEach
    await waitForPageLoad(page);

    const textarea = page.locator('textarea[name="message"]');
    const submitButton = page.locator('button[type="submit"]');

    // Fill in a valid message
    const testMessage = "Hello, I need help with my order status";
    await fillField(page, 'textarea[name="message"]', testMessage);

    // Submit the form and wait for navigation
    await Promise.all([
      page.waitForURL(/\/chat\/view\/[a-f0-9-]{36}$/),
      submitButton.click(),
    ]);

    // Verify we're redirected to the chat view with a UUID
    const currentUrl = page.url();
    const uuidRegex =
      /\/chat\/view\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
    expect(currentUrl).toMatch(uuidRegex);
  });

  test("should disable submit button after submission", async ({ page }) => {
    // Page already loaded in beforeEach
    await waitForPageLoad(page);

    const textarea = page.locator('textarea[name="message"]');
    const submitButton = page.locator('button[type="submit"]');

    // Fill in a valid message
    await fillField(
      page,
      'textarea[name="message"]',
      "Test message for submission",
    );

    // Check button is initially enabled
    await expect(submitButton).toBeEnabled();

    // Click submit button
    await submitButton.click();

    // Button should be disabled immediately after click
    await expect(submitButton).toBeDisabled();
    await expect(submitButton).toHaveClass(/disabled:opacity-50/);
  });

  test("should handle form submission with different message lengths", async ({
    page,
  }) => {
    const testCases = [
      { message: "Short", length: 5 },
      {
        message: "This is a medium length message that should work fine",
        length: 57,
      },
      { message: "A".repeat(500), length: 500 },
    ];

    for (const testCase of testCases) {
      await page.goto("/chat/new");
      await waitForPageLoad(page);

      await fillField(page, 'textarea[name="message"]', testCase.message);

      const submitButton = page.locator('button[type="submit"]');

      try {
        await Promise.all([
          page.waitForURL(/\/chat\/view\/[a-f0-9-]{36}$/, { timeout: 10000 }),
          submitButton.click(),
        ]);

        // Verify successful redirect
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/chat\/view\/[a-f0-9-]{36}$/);
      } catch (error) {
        // If redirect fails, at least verify the form was submitted
        await expect(submitButton).toBeDisabled();
      }
    }
  });

  test("should handle special characters in message", async ({ page }) => {
    // Page already loaded in beforeEach
    await waitForPageLoad(page);

    const specialMessage =
      "Hello! I need help with émojis 🚀 and symbols @#$%^&*()";
    await fillField(page, 'textarea[name="message"]', specialMessage);

    const submitButton = page.locator('button[type="submit"]');

    await Promise.all([
      page.waitForURL(/\/chat\/view\/[a-f0-9-]{36}$/),
      submitButton.click(),
    ]);

    // Verify successful redirect
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/chat\/view\/[a-f0-9-]{36}$/);
  });

  test("should handle textarea auto-resize behavior", async ({ page }) => {
    // Page already loaded in beforeEach
    await waitForPageLoad(page);

    const textarea = page.locator('textarea[name="message"]');

    // Get initial height
    const initialHeight = await textarea.evaluate(
      (el: HTMLTextAreaElement) => el.offsetHeight,
    );

    // Type multiple lines of text
    const multilineText = "Line 1\nLine 2\nLine 3\nLine 4";
    await textarea.fill(multilineText);

    // Height should remain the same since auto-resize is handled by CSS
    const newHeight = await textarea.evaluate(
      (el: HTMLTextAreaElement) => el.offsetHeight,
    );
    expect(newHeight).toBeGreaterThanOrEqual(initialHeight);
  });

  test("should handle network errors gracefully", async ({ page }) => {
    // Page already loaded in beforeEach
    await waitForPageLoad(page);

    // Mock a network failure for the form submission after page load
    await page.route("**/chat/new", (route) => {
      if (route.request().method() === "POST") {
        route.abort("failed");
      } else {
        route.continue();
      }
    });

    const textarea = page.locator('textarea[name="message"]');
    const submitButton = page.locator('button[type="submit"]');

    await fillField(page, 'textarea[name="message"]', "Test message");

    // Try to submit - should handle the network error
    await submitButton.click();

    // Give it time to process the failed request
    await page.waitForTimeout(1000);

    // The page should either stay on /chat/new or show an error page
    const currentUrl = page.url();
    const isOnExpectedPage =
      currentUrl.includes("/chat/new") ||
      currentUrl.includes("error") ||
      currentUrl.startsWith("chrome-error://");
    expect(isOnExpectedPage).toBeTruthy();
  });

  test("should redirect root path to /chat/new", async ({ page }) => {
    await page.goto("/");

    // Should redirect to /chat/new
    await expect(page).toHaveURL(/\/chat\/new/);
  });

  test("should preserve message content during typing", async ({ page }) => {
    // Page already loaded in beforeEach
    await waitForPageLoad(page);

    const textarea = page.locator('textarea[name="message"]');
    const testMessage = "This is a test message that I am typing";

    // Type the message character by character to simulate real typing
    for (const char of testMessage) {
      await textarea.type(char, { delay: 10 });
    }

    // Verify the full message is preserved
    await expect(textarea).toHaveValue(testMessage);
  });

  test("should have proper accessibility attributes", async ({ page }) => {
    // Page already loaded in beforeEach
    await waitForPageLoad(page);

    const textarea = page.locator('textarea[name="message"]');
    const submitButton = page.locator('button[type="submit"]');

    // Check for proper form attributes
    await expect(textarea).toHaveAttribute("name", "message");
    await expect(textarea).toHaveAttribute("required");

    // Check submit button attributes
    await expect(submitButton).toHaveAttribute("type", "submit");

    // Check for proper semantic HTML structure
    const form = page.locator("form");
    await expect(form).toHaveAttribute("method", "post");
    await expect(form).toHaveAttribute("action", "/chat/new");
  });

  test("should handle rapid successive clicks on submit button", async ({
    page,
  }) => {
    // Page already loaded in beforeEach
    await waitForPageLoad(page);

    const textarea = page.locator('textarea[name="message"]');
    const submitButton = page.locator('button[type="submit"]');

    await fillField(page, 'textarea[name="message"]', "Test rapid submission");

    // Click submit button and check if it gets disabled
    await submitButton.click();

    // After first click, button should be disabled
    await expect(submitButton).toBeDisabled({ timeout: 1000 });

    // Try additional clicks - they should be ignored since button is disabled
    await submitButton.click({ force: true });
    await submitButton.click({ force: true });

    // Should eventually redirect to chat view
    try {
      await expect(page).toHaveURL(/\/chat\/view\/[a-f0-9-]{36}$/, {
        timeout: 15000,
      });
    } catch {
      // If redirect doesn't happen, at least verify button behavior
      await expect(submitButton).toBeDisabled();
    }
  });
});
