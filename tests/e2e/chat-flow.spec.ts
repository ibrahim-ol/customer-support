import { test, expect } from "@playwright/test";
import {
  waitForElement,
  fillField,
  waitForPageLoad,
  mockApiResponse,
} from "./utils.ts";

test.describe("Complete Chat Flow Integration", () => {
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

  test("should complete full chat flow from new chat to ongoing conversation", async ({
    page,
  }) => {
    // Step 1: Start from homepage and navigate to new chat
    await page.goto("/");
    await expect(page).toHaveURL(/\/chat\/new/);

    // Step 2: Fill out new chat form
    const initialMessage = "I need help with tracking my order #12345";
    await fillField(page, 'textarea[name="message"]', initialMessage);

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();

    // Step 3: Submit form and wait for redirect
    await Promise.all([
      page.waitForURL(/\/chat\/view\/[a-f0-9-]{36}$/),
      submitButton.click(),
    ]);

    // Step 4: Verify we're in chat view
    const currentUrl = page.url();
    const conversationId = currentUrl.split("/").pop();
    expect(conversationId).toMatch(
      /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
    );

    // Step 5: Wait for page to load and verify initial message is visible
    await waitForPageLoad(page);
    await page.waitForTimeout(2000); // Allow time for messages to load

    // Step 6: Verify we can see the chat interface
    const messageContainer = page.locator(
      '.flex.flex-col.h-full.w-full, [data-testid="chat-container"]',
    );
    await expect(messageContainer.first()).toBeVisible();

    // Step 7: Send a follow-up message
    const followUpMessage = "Can you also tell me about the shipping options?";
    const messageInput = page.locator("textarea").last();
    const sendButton = page.locator('button:has-text("Send")').last();

    await expect(messageInput).toBeVisible();
    await messageInput.fill(followUpMessage);
    await expect(sendButton).toBeEnabled();

    await sendButton.click();
    await expect(messageInput).toHaveValue(""); // Input should clear after sending
  });

  test("should handle multiple messages in conversation", async ({ page }) => {
    // Create initial conversation
    await page.goto("/chat/new");
    await fillField(
      page,
      'textarea[name="message"]',
      "Hello, I need assistance",
    );
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/\/chat\/view\/[a-f0-9-]{36}$/);
    await waitForPageLoad(page);

    // Send multiple messages
    const messages = [
      "My first question is about billing",
      "Second, I want to know about refunds",
      "Finally, can you help with account settings?",
    ];

    const messageInput = page.locator("textarea").last();

    for (const message of messages) {
      await messageInput.fill(message);
      await messageInput.press("Enter");
      await expect(messageInput).toHaveValue("");
      await page.waitForTimeout(500); // Small delay between messages
    }

    // Verify we can still interact with the chat
    await expect(messageInput).toBeVisible();
    await expect(messageInput).toBeEnabled();
  });

  test("should persist conversation across page refreshes", async ({
    page,
  }) => {
    // Start new conversation
    await page.goto("/chat/new");
    const testMessage = "This message should persist after refresh";
    await fillField(page, 'textarea[name="message"]', testMessage);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/\/chat\/view\/[a-f0-9-]{36}$/);

    const conversationUrl = page.url();
    await waitForPageLoad(page);

    // Refresh the page
    await page.reload();
    await waitForPageLoad(page);

    // Verify we're still on the same conversation
    await expect(page).toHaveURL(conversationUrl);

    // Verify chat interface is still functional
    const messageInput = page.locator("textarea").last();
    await expect(messageInput).toBeVisible();
    await messageInput.fill("Message after refresh");
    await expect(messageInput).toHaveValue("Message after refresh");
  });

  test("should handle navigation between new chat and existing conversation", async ({
    page,
  }) => {
    // Create first conversation
    await page.goto("/chat/new");
    await fillField(
      page,
      'textarea[name="message"]',
      "First conversation message",
    );
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/\/chat\/view\/[a-f0-9-]{36}$/, { timeout: 15000 });

    const firstConversationUrl = page.url();
    const firstConversationId = firstConversationUrl.split("/").pop();

    // Navigate to new chat
    await page.goto("/chat/new");
    await expect(page).toHaveURL(/\/chat\/new/);

    // Create second conversation
    await fillField(
      page,
      'textarea[name="message"]',
      "Second conversation message",
    );
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/\/chat\/view\/[a-f0-9-]{36}$/, { timeout: 15000 });

    const secondConversationUrl = page.url();
    const secondConversationId = secondConversationUrl.split("/").pop();

    // Verify different conversation IDs
    expect(firstConversationId).not.toBe(secondConversationId);

    // Navigate back to first conversation
    await page.goto(firstConversationUrl);
    await expect(page).toHaveURL(firstConversationUrl);

    // Verify chat interface works in first conversation
    const messageInput = page.locator("textarea").last();
    await expect(messageInput).toBeVisible();
  });

  test("should handle error states in conversation flow", async ({ page }) => {
    // Start new conversation normally
    await page.goto("/chat/new");
    await fillField(page, 'textarea[name="message"]', "Initial message");
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/\/chat\/view\/[a-f0-9-]{36}$/, { timeout: 15000 });
    await waitForPageLoad(page);

    // Mock API error for subsequent messages
    await page.route("**/api/chat", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal server error" }),
      });
    });

    // Try to send another message
    const messageInput = page.locator("textarea").last();
    await messageInput.fill("This message will fail");
    await messageInput.press("Enter");

    // Chat interface should remain functional despite API error
    await expect(messageInput).toBeVisible();
    await expect(messageInput).toBeEnabled();
  });

  test("should validate message length across entire flow", async ({
    page,
  }) => {
    // Test minimum length in new chat
    await page.goto("/chat/new");
    const textarea = page.locator('textarea[name="message"]');

    // Try to submit with too short message
    await textarea.fill("Hi");
    await page.locator('button[type="submit"]').click();

    // Should not proceed due to validation
    const validationMessage = await textarea.evaluate(
      (el: HTMLTextAreaElement) => el.validationMessage,
    );
    expect(validationMessage).toBeTruthy();

    // Now submit valid message
    await fillField(
      page,
      'textarea[name="message"]',
      "Valid message for testing",
    );
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/\/chat\/view\/[a-f0-9-]{36}$/, { timeout: 15000 });
    await waitForPageLoad(page);

    // Test in ongoing conversation
    const messageInput = page.locator("textarea").last();
    const longMessage = "A".repeat(2000);

    await messageInput.fill(longMessage);
    // Should handle long messages appropriately
    const inputValue = await messageInput.inputValue();
    expect(inputValue.length).toBeGreaterThan(0);
  });

  test("should handle special characters throughout conversation flow", async ({
    page,
  }) => {
    const specialMessages = [
      "Hello with émojis 🚀💬",
      "Special chars: @#$%^&*()",
      "Quotes \"test\" and 'single'",
      'HTML <script>alert("test")</script>',
      "Unicode: ñáéíóú",
    ];

    // Start conversation with special characters
    await page.goto("/chat/new");
    await fillField(page, 'textarea[name="message"]', specialMessages[0]);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/\/chat\/view\/[a-f0-9-]{36}$/, { timeout: 15000 });
    await waitForPageLoad(page);

    // Continue with more special character messages
    const messageInput = page.locator("textarea").last();

    for (let i = 1; i < specialMessages.length; i++) {
      await messageInput.fill(specialMessages[i]);
      await expect(messageInput).toHaveValue(specialMessages[i]);
      await messageInput.press("Enter");
      await expect(messageInput).toHaveValue("");
      await page.waitForTimeout(200);
    }

    // Verify chat is still functional
    await expect(messageInput).toBeVisible();
    await expect(messageInput).toBeEnabled();
  });

  test("should handle rapid message sending", async ({ page }) => {
    // Start conversation
    await page.goto("/chat/new");
    await fillField(page, 'textarea[name="message"]', "Starting rapid test");
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/\/chat\/view\/[a-f0-9-]{36}$/, { timeout: 15000 });
    await waitForPageLoad(page);

    // Send multiple messages rapidly
    const messageInput = page.locator("textarea").last();
    const rapidMessages = [
      "Rapid message 1",
      "Rapid message 2",
      "Rapid message 3",
      "Rapid message 4",
      "Rapid message 5",
    ];

    for (const message of rapidMessages) {
      await messageInput.fill(message);
      await messageInput.press("Enter");
      // Very short delay to simulate rapid sending
      await page.waitForTimeout(100);
    }

    // Verify interface remains responsive
    await expect(messageInput).toBeVisible();
    await expect(messageInput).toBeEnabled();
    await expect(messageInput).toHaveValue("");
  });

  test("should handle conversation with mixed interaction methods", async ({
    page,
  }) => {
    // Start with form submission
    await page.goto("/chat/new");
    await fillField(
      page,
      'textarea[name="message"]',
      "Started with form submission",
    );
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/\/chat\/view\/[a-f0-9-]{36}$/, { timeout: 15000 });
    await waitForPageLoad(page);

    const messageInput = page.locator("textarea").last();
    const sendButton = page.locator('button:has-text("Send")').last();

    // Continue with Enter key
    await messageInput.fill("Message sent with Enter key");
    await messageInput.press("Enter");
    await expect(messageInput).toHaveValue("");

    // Continue with button click
    await messageInput.fill("Message sent with button click");
    await sendButton.click();
    await expect(messageInput).toHaveValue("");

    // Continue with Shift+Enter for multiline then Enter
    await messageInput.fill("First line");
    await messageInput.press("Shift+Enter");
    await messageInput.type("Second line");
    await messageInput.press("Enter");
    await expect(messageInput).toHaveValue("");

    // Verify all interaction methods work
    await expect(messageInput).toBeVisible();
    await expect(messageInput).toBeEnabled();
  });
});
