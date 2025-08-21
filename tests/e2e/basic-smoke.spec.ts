import { test, expect } from "@playwright/test";
import { waitForPageLoad, fillField } from "./utils.ts";

test.describe("Basic Smoke Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to page first
    await page.goto("/chat/new");
    await page.evaluate(() => {
      if (typeof Storage !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }
    });
  });

  test("should load homepage and redirect to new chat", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/chat\/new/);

    // Verify basic elements are present
    await expect(page.locator("textarea[name='message']")).toBeVisible();
    await expect(page.locator("button[type='submit']")).toBeVisible();
  });

  test("should load new chat page with form elements", async ({ page }) => {
    await waitForPageLoad(page);

    // Check URL
    await expect(page).toHaveURL(/\/chat\/new/);

    // Check form elements
    const textarea = page.locator("textarea[name='message']");
    const submitButton = page.locator("button[type='submit']");

    await expect(textarea).toBeVisible();
    await expect(submitButton).toBeVisible();
    await expect(textarea).toHaveAttribute(
      "placeholder",
      "How can I help you today?",
    );
    await expect(submitButton).toHaveText("Send");
  });

  test("should accept user input in message field", async ({ page }) => {
    await waitForPageLoad(page);

    const textarea = page.locator("textarea[name='message']");
    const testMessage = "Hello, this is a test message";

    await textarea.fill(testMessage);
    await expect(textarea).toHaveValue(testMessage);
  });

  test("should validate minimum message length", async ({ page }) => {
    await waitForPageLoad(page);

    const textarea = page.locator("textarea[name='message']");
    const submitButton = page.locator("button[type='submit']");

    // Try with short message
    await textarea.fill("Hi");
    await submitButton.click();

    // Should prevent submission due to minlength validation
    const validationMessage = await textarea.evaluate(
      (el: HTMLTextAreaElement) => el.validationMessage,
    );
    expect(validationMessage).toBeTruthy();
  });

  test("should successfully submit valid message", async ({ page }) => {
    await waitForPageLoad(page);

    const textarea = page.locator("textarea[name='message']");
    const submitButton = page.locator("button[type='submit']");

    // Fill valid message
    await fillField(
      page,
      "textarea[name='message']",
      "Hello, I need help with my account",
    );

    // Submit and wait for redirect
    await submitButton.click();

    // Should redirect to chat view with conversation ID
    await page.waitForURL(/\/chat\/view\//, { timeout: 10000 });

    const url = page.url();
    expect(url).toMatch(/\/chat\/view\/[a-f0-9-]{36}$/);
  });

  test("should handle chat view page load", async ({ page }) => {
    // First create a conversation
    await fillField(
      page,
      "textarea[name='message']",
      "Test message for chat view",
    );
    await page.locator("button[type='submit']").click();

    // Wait for redirect to chat view
    await page.waitForURL(/\/chat\/view\/[a-f0-9-]{36}$/, { timeout: 10000 });

    // Verify we're on the chat view page
    const url = page.url();
    expect(url).toMatch(/\/chat\/view\/[a-f0-9-]{36}$/);

    // Wait for page to stabilize
    await waitForPageLoad(page);

    // Basic check that the chat interface loaded
    await expect(page.locator("body")).toBeVisible();
  });

  test("should handle error query parameter", async ({ page }) => {
    await page.goto("/chat/new?error=test_error");
    await waitForPageLoad(page);

    // Should display error message
    const errorElement = page.locator("p.text-red-500");
    await expect(errorElement).toBeVisible();
    await expect(errorElement).toHaveText("test_error");
  });

  test("should have proper form attributes", async ({ page }) => {
    await waitForPageLoad(page);

    const form = page.locator("form[action='/chat/new']");
    const textarea = page.locator("textarea[name='message']");
    const submitButton = page.locator("button[type='submit']");

    // Check form structure
    await expect(form).toBeVisible();
    await expect(form).toHaveAttribute("method", "post");

    // Check input attributes
    await expect(textarea).toHaveAttribute("required");
    await expect(textarea).toHaveAttribute("minlength", "5");
    await expect(textarea).toHaveAttribute("maxlength", "1000");

    // Check button
    await expect(submitButton).toHaveAttribute("type", "submit");
  });
});
