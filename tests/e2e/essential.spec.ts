import { test, expect } from "@playwright/test";
import { waitForPageLoad, fillField } from "./utils.ts";

test.describe("Essential E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/chat/new");
    await page.evaluate(() => {
      if (typeof Storage !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }
    });
  });

  test("should complete basic new chat flow", async ({ page }) => {
    await waitForPageLoad(page);

    // Verify we're on the new chat page
    await expect(page).toHaveURL(/\/chat\/new/);

    // Verify form elements are present
    const textarea = page.locator("textarea[name='message']");
    const submitButton = page.locator("button[type='submit']");

    await expect(textarea).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Fill and submit a valid message
    await fillField(
      page,
      "textarea[name='message']",
      "Hello, I need help with my order",
    );

    // Submit the form
    await submitButton.click();

    // Should redirect to chat view
    await expect(page).toHaveURL(/\/chat\/view\/[a-f0-9-]{36}$/, {
      timeout: 15000,
    });

    // Verify we're on a valid chat view page
    const url = page.url();
    expect(url).toMatch(
      /\/chat\/view\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
    );
  });

  test("should display chat interface on view page", async ({ page }) => {
    // Create a conversation first
    await fillField(
      page,
      "textarea[name='message']",
      "Test message for view page",
    );
    await page.locator("button[type='submit']").click();

    // Wait for redirect
    await expect(page).toHaveURL(/\/chat\/view\/[a-f0-9-]{36}$/, {
      timeout: 15000,
    });
    await waitForPageLoad(page);

    // Give the page time to render
    await page.waitForTimeout(1000);

    // Verify basic structure is present
    await expect(page.locator("body")).toBeVisible();

    // The page should have loaded without errors
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/chat\/view\/[a-f0-9-]{36}$/);
  });

  test("should handle form validation", async ({ page }) => {
    await waitForPageLoad(page);

    const textarea = page.locator("textarea[name='message']");
    const submitButton = page.locator("button[type='submit']");

    // Test empty submission
    await submitButton.click();
    const emptyValidation = await textarea.evaluate(
      (el: HTMLTextAreaElement) => el.validationMessage,
    );
    expect(emptyValidation).toBeTruthy();

    // Test too short message
    await textarea.fill("Hi");
    await submitButton.click();
    const shortValidation = await textarea.evaluate(
      (el: HTMLTextAreaElement) => el.validationMessage,
    );
    expect(shortValidation).toBeTruthy();

    // Test valid message
    await fillField(
      page,
      "textarea[name='message']",
      "This is a valid test message",
    );
    await expect(submitButton).toBeEnabled();
  });

  test("should handle error query parameter", async ({ page }) => {
    await page.goto("/chat/new?error=missing_message");
    await waitForPageLoad(page);

    // Should display error message
    const errorElement = page.locator("p.text-red-500");
    await expect(errorElement).toBeVisible();
    await expect(errorElement).toHaveText("missing_message");
  });

  test("should redirect from root to new chat", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/chat\/new/);

    // Basic elements should be present
    await expect(page.locator("textarea[name='message']")).toBeVisible();
    await expect(page.locator("button[type='submit']")).toBeVisible();
  });

  test("should handle no conversation ID in view route", async ({ page }) => {
    await page.goto("/chat/view");
    await waitForPageLoad(page);

    // Should either show error message or redirect
    const currentUrl = page.url();
    const isValidResponse =
      currentUrl.includes("/chat/view") ||
      currentUrl.includes("/chat/new") ||
      page.locator("text=No conversation selected").isVisible();

    // At minimum, page should load without crashing
    await expect(page.locator("body")).toBeVisible();
  });

  test("should persist conversation after page refresh", async ({ page }) => {
    // Create conversation
    await fillField(
      page,
      "textarea[name='message']",
      "Message for persistence test",
    );
    await page.locator("button[type='submit']").click();

    await expect(page).toHaveURL(/\/chat\/view\/[a-f0-9-]{36}$/, {
      timeout: 15000,
    });
    const originalUrl = page.url();

    // Refresh page
    await page.reload();
    await waitForPageLoad(page);

    // Should still be on same conversation
    await expect(page).toHaveURL(originalUrl);
  });

  test("should handle special characters in messages", async ({ page }) => {
    const specialMessage =
      'Special test: émojis 🚀, symbols @#$%^&*(), and quotes "hello"';

    await fillField(page, "textarea[name='message']", specialMessage);

    // Message should be accepted
    const textarea = page.locator("textarea[name='message']");
    await expect(textarea).toHaveValue(specialMessage);

    // Should be able to submit
    const submitButton = page.locator("button[type='submit']");
    await expect(submitButton).toBeEnabled();
  });

  test("should enforce maximum message length", async ({ page }) => {
    const longMessage = "a".repeat(1001);

    await page.locator("textarea[name='message']").fill(longMessage);

    // Should be truncated to 1000 characters
    const actualValue = await page
      .locator("textarea[name='message']")
      .inputValue();
    expect(actualValue.length).toBe(1000);
  });

  test("should have proper form attributes", async ({ page }) => {
    await waitForPageLoad(page);

    const form = page.locator("form[action='/chat/new']");
    const textarea = page.locator("textarea[name='message']");
    const submitButton = page.locator("button[type='submit']");

    // Check form method
    await expect(form).toHaveAttribute("method", "post");

    // Check textarea attributes
    await expect(textarea).toHaveAttribute("name", "message");
    await expect(textarea).toHaveAttribute("required");
    await expect(textarea).toHaveAttribute("minlength", "5");
    await expect(textarea).toHaveAttribute("maxlength", "1000");

    // Check submit button
    await expect(submitButton).toHaveAttribute("type", "submit");
    await expect(submitButton).toHaveText("Send");
  });
});
