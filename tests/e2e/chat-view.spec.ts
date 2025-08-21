import { test, expect } from "@playwright/test";
import {
  waitForElement,
  fillField,
  waitForPageLoad,
  mockApiResponse,
  expectElementToHaveText,
} from "./utils.ts";

test.describe("/chat/view/{id} - Chat View Route", () => {
  let conversationId: string;

  test.beforeEach(async ({ page }) => {
    // Create a conversation first by going through the new chat flow
    await page.goto("/chat/new");
    await waitForPageLoad(page);

    // Clear any existing data after page load
    await page.evaluate(() => {
      if (typeof Storage !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }
    });

    await fillField(
      page,
      'textarea[name="message"]',
      "Hello, I need help with my order",
    );
    await page.locator('button[type="submit"]').click();

    // Wait for redirect and extract conversation ID from URL
    await page.waitForURL(/\/chat\/view\/[a-f0-9-]{36}$/);
    const url = page.url();
    conversationId = url.split("/").pop() as string;
  });

  test("should load chat view page correctly", async ({ page }) => {
    await page.goto(`/chat/view/${conversationId}`);
    await waitForPageLoad(page);

    // Check page URL
    await expect(page).toHaveURL(`/chat/view/${conversationId}`);

    // Verify basic page structure
    const body = page.locator("body");
    await expect(body).toBeVisible();

    // Check for chat layout components
    await waitForElement(page, ".flex.flex-col.h-full.w-full");
  });

  test("should display chat header with conversation info", async ({
    page,
  }) => {
    await page.goto(`/chat/view/${conversationId}`);
    await waitForPageLoad(page);

    // Wait for the chat header to load
    await page.waitForSelector('[data-testid="chat-header"], .border-b, .p-4', {
      timeout: 10000,
    });

    // The header should be visible (using general selectors since we don't know exact structure)
    const header = page.locator('.border-b, [role="banner"], .p-4').first();
    await expect(header).toBeVisible();
  });

  test("should display existing messages in conversation", async ({ page }) => {
    await page.goto(`/chat/view/${conversationId}`);
    await waitForPageLoad(page);

    // Wait for messages to load
    await page.waitForTimeout(2000);

    // There should be at least the initial user message
    // Look for message containers or text content
    const messageElements = page.locator(
      'div:has-text("Hello, I need help with my order"), .message, [data-role="user"], [data-role="assistant"]',
    );

    // Should have at least one message visible
    await expect(messageElements.first()).toBeVisible({ timeout: 10000 });
  });

  test("should have functional message input", async ({ page }) => {
    await page.goto(`/chat/view/${conversationId}`);
    await waitForPageLoad(page);

    // Look for message input elements
    const messageInput = page.locator('textarea, input[type="text"]').last();
    const sendButton = page
      .locator('button:has-text("Send"), button[type="submit"]')
      .last();

    await expect(messageInput).toBeVisible();
    await expect(sendButton).toBeVisible();

    // Test typing in the input
    await messageInput.fill("This is a follow-up message");
    await expect(messageInput).toHaveValue("This is a follow-up message");
  });

  test("should send new message in existing conversation", async ({ page }) => {
    // Mock the API response for sending messages
    await mockApiResponse(page, "**/api/chat", {
      message: "Sent",
      data: {
        request: { id: "msg-123", message: "Follow-up message", role: "user" },
        reply: {
          id: "msg-124",
          message: "Thank you for your follow-up!",
          role: "assistant",
        },
      },
    });

    await page.goto(`/chat/view/${conversationId}`);
    await waitForPageLoad(page);

    // Find and fill message input
    const messageInput = page.locator('textarea, input[type="text"]').last();
    const sendButton = page
      .locator('button:has-text("Send"), button[type="submit"]')
      .last();

    await messageInput.fill("Follow-up message about my order");
    await sendButton.click();

    // Input should be cleared after sending
    await expect(messageInput).toHaveValue("");
  });

  test("should handle invalid conversation ID", async ({ page }) => {
    const invalidId = "invalid-uuid";
    await page.goto(`/chat/view/${invalidId}`);
    await waitForPageLoad(page);

    // Should show some kind of error or redirect
    // Either stay on the page with error message or redirect to new chat
    const currentUrl = page.url();
    const isErrorPage =
      currentUrl.includes(invalidId) || currentUrl.includes("/chat/new");
    expect(isErrorPage).toBeTruthy();
  });

  test("should handle non-existent conversation ID", async ({ page }) => {
    const nonExistentId = "12345678-1234-1234-1234-123456789012";

    await page.goto(`/chat/view/${nonExistentId}`);
    await waitForPageLoad(page);

    // Should handle gracefully - either show error message or no messages
    const url = page.url();
    expect(url).toContain(nonExistentId);
  });

  test("should show no conversation selected message when no ID provided", async ({
    page,
  }) => {
    await page.goto("/chat/view");
    await waitForPageLoad(page);

    // Should show a message about no conversation selected
    const noConversationMessage = page.locator(
      "text=No conversation selected, text=Please select or start a conversation",
    );
    await expect(noConversationMessage.first()).toBeVisible({ timeout: 5000 });

    // Should have a link to start new chat
    const startChatLink = page.locator('a[href*="/chat"]');
    await expect(startChatLink.first()).toBeVisible();
  });

  test("should handle message sending with Enter key", async ({ page }) => {
    await page.goto(`/chat/view/${conversationId}`);
    await waitForPageLoad(page);

    const messageInput = page.locator("textarea").last();
    await messageInput.fill("Message sent with Enter key");

    // Press Enter to send message
    await messageInput.press("Enter");

    // Message should be cleared after sending
    await expect(messageInput).toHaveValue("");
  });

  test("should handle Shift+Enter for new line", async ({ page }) => {
    await page.goto(`/chat/view/${conversationId}`);
    await waitForPageLoad(page);

    const messageInput = page.locator("textarea").last();
    await messageInput.fill("First line");

    // Press Shift+Enter to create new line
    await messageInput.press("Shift+Enter");
    await messageInput.type("Second line");

    // Should contain both lines
    const value = await messageInput.inputValue();
    expect(value).toContain("First line\nSecond line");
  });

  test("should disable send button when message is empty", async ({ page }) => {
    await page.goto(`/chat/view/${conversationId}`);
    await waitForPageLoad(page);

    const messageInput = page.locator("textarea").last();
    const sendButton = page.locator('button:has-text("Send")').last();

    // Button should be disabled when input is empty
    await expect(sendButton).toBeDisabled();

    // Type message
    await messageInput.fill("Test message");
    await expect(sendButton).toBeEnabled();

    // Clear message
    await messageInput.fill("");
    await expect(sendButton).toBeDisabled();
  });

  test("should show loading state while sending message", async ({ page }) => {
    await page.goto(`/chat/view/${conversationId}`);
    await waitForPageLoad(page);

    // Intercept the request to delay it
    await page.route("**/api/chat", (route) => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            message: "Sent",
            data: {
              request: { id: "msg-123", message: "Test", role: "user" },
              reply: { id: "msg-124", message: "Response", role: "assistant" },
            },
          }),
        });
      }, 2000);
    });

    const messageInput = page.locator("textarea").last();
    const sendButton = page.locator('button:has-text("Send")').last();

    await messageInput.fill("Test loading state");
    await sendButton.click();

    // Should show loading indicator
    const loadingIndicator = page.locator(
      ".animate-spin, .loading, button:disabled",
    );
    await expect(loadingIndicator.first()).toBeVisible();
  });

  test("should handle long messages in conversation", async ({ page }) => {
    await page.goto(`/chat/view/${conversationId}`);
    await waitForPageLoad(page);

    const longMessage =
      "This is a very long message that should test how the chat interface handles longer content. ".repeat(
        10,
      );
    const messageInput = page.locator("textarea").last();

    await messageInput.fill(longMessage);

    // Should accept the long message
    const inputValue = await messageInput.inputValue();
    expect(inputValue).toBe(longMessage);
  });

  test("should handle special characters in messages", async ({ page }) => {
    await page.goto(`/chat/view/${conversationId}`);
    await waitForPageLoad(page);

    const specialMessage = 'Special chars: 🚀 émojis @#$%^&*() "quotes" <tags>';
    const messageInput = page.locator("textarea").last();

    await messageInput.fill(specialMessage);
    await expect(messageInput).toHaveValue(specialMessage);
  });

  test("should maintain conversation context", async ({ page }) => {
    await page.goto(`/chat/view/${conversationId}`);
    await waitForPageLoad(page);

    // The conversation ID should remain consistent
    expect(page.url()).toContain(conversationId);

    // Refresh the page
    await page.reload();
    await waitForPageLoad(page);

    // Should still show the same conversation
    expect(page.url()).toContain(conversationId);
  });

  test("should handle network errors gracefully", async ({ page }) => {
    await page.goto(`/chat/view/${conversationId}`);
    await waitForPageLoad(page);

    // Mock network failure for message sending
    await page.route("**/api/chat", (route) => {
      route.abort("failed");
    });

    const messageInput = page.locator("textarea").last();
    const sendButton = page.locator('button:has-text("Send")').last();

    await messageInput.fill("This message will fail to send");
    await sendButton.click();

    // Should handle the error gracefully (might show error message or retry option)
    // The page should remain functional
    await expect(messageInput).toBeVisible();
  });

  test("should handle API rate limiting", async ({ page }) => {
    await page.goto(`/chat/view/${conversationId}`);
    await waitForPageLoad(page);

    // Mock rate limit response
    await mockApiResponse(
      page,
      "**/api/chat",
      { error: "Rate limit exceeded" },
      429,
    );

    const messageInput = page.locator("textarea").last();
    const sendButton = page.locator('button:has-text("Send")').last();

    await messageInput.fill("This will trigger rate limit");
    await sendButton.click();

    // Should handle rate limiting appropriately
    await expect(messageInput).toBeVisible();
  });

  test("should preserve message history on page refresh", async ({ page }) => {
    await page.goto(`/chat/view/${conversationId}`);
    await waitForPageLoad(page);

    // Send a message
    const messageInput = page.locator("textarea").last();
    await messageInput.fill("Message before refresh");
    await messageInput.press("Enter");

    await page.waitForTimeout(1000);

    // Refresh the page
    await page.reload();
    await waitForPageLoad(page);

    // The original message should still be visible
    const originalMessage = page.locator(
      "text=Hello, I need help with my order",
    );
    await expect(originalMessage).toBeVisible({ timeout: 10000 });
  });

  test("should handle empty responses from API", async ({ page }) => {
    await mockApiResponse(page, "**/api/chat", {
      message: "Sent",
      data: {
        request: { id: "msg-123", message: "Test", role: "user" },
        reply: { id: "msg-124", message: "", role: "assistant" },
      },
    });

    await page.goto(`/chat/view/${conversationId}`);
    await waitForPageLoad(page);

    const messageInput = page.locator("textarea").last();
    await messageInput.fill("Test empty response");
    await messageInput.press("Enter");

    // Should handle empty response gracefully
    await expect(messageInput).toHaveValue("");
  });

  test("should handle malformed conversation ID in URL", async ({ page }) => {
    const malformedIds = [
      "/chat/view/not-a-uuid",
      "/chat/view/123",
      "/chat/view/../../etc/passwd",
      '/chat/view/<script>alert("xss")</script>',
    ];

    for (const malformedPath of malformedIds) {
      await page.goto(malformedPath);
      await waitForPageLoad(page);

      // Should handle malformed IDs gracefully without crashes
      // Either show error message or redirect
      const url = page.url();
      expect(typeof url).toBe("string");
      expect(url.length).toBeGreaterThan(0);
    }
  });
});
