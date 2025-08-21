# End-to-End Testing with Playwright

This directory contains the end-to-end (E2E) testing setup using Playwright for the AI Customer Support application.

## Setup

The Playwright setup is already configured and ready to use. The setup includes:

- **Playwright Test Runner**: Configured to run tests across multiple browsers
- **TypeScript Support**: Full TypeScript support for test files
- **Global Setup**: Automatic server startup and teardown
- **Utilities**: Helper functions for common test operations

## Project Structure

```
tests/e2e/
├── README.md           # This file
├── global-setup.ts     # Global setup configuration
├── utils.ts           # Helper utilities for tests
├── basic-smoke.spec.ts # Basic functionality smoke tests
├── chat-new.spec.ts   # Tests for /chat/new route
├── chat-view.spec.ts  # Tests for /chat/view/{id} route
└── chat-flow.spec.ts  # Integration tests for complete chat flow
```

## Running Tests

### Basic Commands

```bash
# Run all E2E tests
yarn test:e2e

# Run tests with UI mode (interactive)
yarn test:e2e:ui

# Run tests in debug mode
yarn test:e2e:debug

# Show test report
yarn test:e2e:report
```

### Advanced Commands

```bash
# Run tests in a specific browser
yarn test:e2e --project=chromium
yarn test:e2e --project=firefox
yarn test:e2e --project=webkit

# Run tests in headed mode (visible browser)
yarn test:e2e --headed

# Run specific test file
yarn test:e2e tests/e2e/example.spec.ts

# Run tests matching a pattern
yarn test:e2e --grep "homepage"
```

## Configuration

The main configuration is in `playwright.config.ts` at the project root. Key settings:

- **Base URL**: `http://localhost:3000`
- **Test Directory**: `./tests/e2e`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Auto Server**: Automatically starts `yarn start` before tests
- **Artifacts**: Screenshots, videos, and traces on failure

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    
    // Your test logic here
    await expect(page).toHaveTitle(/Expected Title/);
  });
});
```

### Using Utilities

The `utils.ts` file provides helpful functions:

```typescript
import { test, expect } from '@playwright/test';
import { waitForElement, fillField, clickAndWait } from './utils';

test('should use utilities', async ({ page }) => {
  await page.goto('/');
  
  // Wait for element and interact with it
  const button = await waitForElement(page, '[data-testid="submit-btn"]');
  await button.click();
  
  // Fill form fields
  await fillField(page, '#email', 'test@example.com');
  
  // Click and wait for navigation
  await clickAndWait(page, '#submit', { waitForNavigation: true });
});
```

## Test Organization

### File Naming
- Use `.spec.ts` suffix for test files
- Name files descriptively: `customer-chat.spec.ts`, `auth-flow.spec.ts`

### Test Structure
- Group related tests using `test.describe()`
- Use descriptive test names that explain the expected behavior
- Follow the AAA pattern: Arrange, Act, Assert

### Page Object Model (Recommended)
For complex applications, consider creating page objects:

```typescript
// pages/HomePage.ts
export class HomePage {
  constructor(private page: Page) {}
  
  async goto() {
    await this.page.goto('/');
  }
  
  async clickChatButton() {
    await this.page.click('[data-testid="start-chat"]');
  }
}

// In test file
import { HomePage } from '../pages/HomePage';

test('should start chat', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickChatButton();
});
```

## Best Practices

### 1. Use Data Test IDs
```html
<button data-testid="submit-button">Submit</button>
```
```typescript
await page.click('[data-testid="submit-button"]');
```

### 2. Wait for Elements
```typescript
// Good - wait for element
await expect(page.locator('#result')).toBeVisible();

// Avoid - arbitrary waits
await page.waitForTimeout(1000);
```

### 3. Mock External APIs
```typescript
import { mockApiResponse } from './utils';

test('should handle API response', async ({ page }) => {
  await mockApiResponse(page, '**/api/chat', { message: 'Hello' });
  await page.goto('/chat');
});
```

### 4. Clean Test Data
```typescript
test.beforeEach(async ({ page }) => {
  // Clean up test data
  await page.evaluate(() => localStorage.clear());
});
```

### 5. Use Fixtures for Common Setup
```typescript
// fixtures.ts
export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    // Login logic here
    await page.goto('/login');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password');
    await page.click('#login');
    await use(page);
  },
});
```

## Debugging

### Visual Debugging
```bash
# Run with headed browser
yarn test:e2e --headed

# Debug specific test
yarn test:e2e --debug tests/e2e/example.spec.ts
```

### Trace Viewer
When tests fail, traces are automatically collected:
```bash
# View traces
yarn test:e2e:report
```

### Screenshots and Videos
- Screenshots are taken on failure
- Videos are recorded on failure
- Files are saved in `test-results/`

## CI/CD Integration

The configuration is optimized for CI environments:
- Uses 1 worker on CI for stability
- Retries failed tests 2 times on CI
- Generates HTML reports

## Test Coverage

Our E2E test suite covers the following areas:

### `/chat/new` Route Tests (`chat-new.spec.ts`)
- ✅ Page loading and basic structure
- ✅ Form validation (required fields, min/max length)
- ✅ Message submission and redirect to chat view
- ✅ Error handling and display
- ✅ Special characters and edge cases
- ✅ Network error resilience
- ✅ Accessibility attributes

### `/chat/view/{id}` Route Tests (`chat-view.spec.ts`)
- ✅ Chat view page loading
- ✅ Message display and history
- ✅ Message input functionality
- ✅ Real-time message sending
- ✅ Keyboard shortcuts (Enter, Shift+Enter)
- ✅ Invalid conversation ID handling
- ✅ Loading states and error handling
- ✅ Message persistence across refreshes

### Integration Tests (`chat-flow.spec.ts`)
- ✅ Complete chat flow from new to ongoing conversation
- ✅ Multiple messages in single conversation
- ✅ Navigation between different conversations
- ✅ Network interruption recovery
- ✅ Mixed interaction methods (form, Enter key, button clicks)
- ✅ Special character handling throughout flow
- ✅ Rapid message sending scenarios

### Basic Smoke Tests (`basic-smoke.spec.ts`)
- ✅ Critical path functionality verification
- ✅ Quick validation of core features
- ✅ Useful for CI/CD pipeline smoke testing

## Running Specific Test Suites

```bash
# Run all chat-related tests
yarn test:e2e chat-*.spec.ts

# Run only new chat functionality tests
yarn test:e2e chat-new.spec.ts

# Run only chat view functionality tests
yarn test:e2e chat-view.spec.ts

# Run integration tests
yarn test:e2e chat-flow.spec.ts

# Run quick smoke tests
yarn test:e2e basic-smoke.spec.ts

# Run with specific filters
yarn test:e2e --grep "should handle special characters"
```

## Test Data and Fixtures

The tests are designed to be self-contained and create their own test data. Each test:

1. **Starts fresh**: Clears localStorage/sessionStorage before each test
2. **Creates conversations**: Uses the actual application flow to create test conversations
3. **Cleans up**: Tests are isolated and don't interfere with each other

## Debugging Failed Tests

When tests fail, Playwright automatically generates helpful artifacts:

### Screenshots and Videos
- Screenshots taken on failure: `test-results/screenshots/`
- Videos recorded on failure: `test-results/videos/`
- View with: `yarn test:e2e:report`

### Debug Mode
```bash
# Run specific test in debug mode
yarn test:e2e:debug chat-new.spec.ts --grep "should submit valid message"

# Run with headed browser (visible)
yarn test:e2e --headed
```

### Trace Files
- Traces captured on retry: `test-results/traces/`
- View traces: `yarn playwright show-trace trace-file.zip`

## Adding New Tests

When adding new tests, follow these patterns:

### 1. Test File Structure
```typescript
import { test, expect } from "@playwright/test";
import { waitForPageLoad, fillField } from "./utils";

test.describe("Feature Name", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/your-route");
    await page.evaluate(() => {
      if (typeof Storage !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }
    });
  });

  test("should do something specific", async ({ page }) => {
    // Your test logic here
  });
});
```

### 2. Use Utility Functions
```typescript
// Instead of raw Playwright calls, use our utilities
await fillField(page, "textarea[name='message']", "Test message");
await waitForPageLoad(page);
await startNewChat(page, "Initial message");
```

### 3. Robust Element Selection
```typescript
// Prefer specific selectors
page.locator("textarea[name='message']")
page.locator("button[type='submit']")

// Use data attributes when available
page.locator("[data-testid='submit-button']")

// Fall back to text content for dynamic elements
page.locator('button:has-text("Send")')
```

## Continuous Integration

The tests are configured for CI environments:

- **Headless execution**: Tests run without visible browser
- **Parallel execution**: Multiple tests run simultaneously for speed
- **Retry mechanism**: Failed tests are retried automatically
- **Artifact collection**: Screenshots/videos saved on failures

### CI Configuration
```yaml
# Example GitHub Actions configuration
- name: Run E2E Tests
  run: yarn test:e2e
  env:
    CI: true
```

## Performance Considerations

- **Test parallelization**: Tests run in parallel by default
- **Smart waiting**: Uses Playwright's auto-waiting instead of timeouts
- **Selective testing**: Run only relevant tests during development
- **Resource cleanup**: Tests clean up after themselves

## Troubleshooting

### Common Issues

1. **Server not starting**: 
   - Check that `yarn start` works manually
   - Verify port 3000 is available
   - Check global setup logs

2. **Element not found**: 
   - Ensure elements have proper selectors
   - Use `page.screenshot()` to debug page state
   - Check if page loaded completely

3. **Timing issues**: 
   - Use Playwright's auto-waiting instead of manual waits
   - Prefer `expect().toBeVisible()` over `waitForTimeout()`

4. **Flaky tests**: 
   - Add proper waiting conditions
   - Avoid hard-coded delays
   - Use `page.waitForLoadState('networkidle')`

5. **Storage access errors**:
   - Always navigate to page before clearing storage
   - Wrap storage operations in `if (typeof Storage !== "undefined")`

### Debugging Tips

```bash
# Run single test in debug mode
yarn test:e2e:debug --grep "specific test name"

# Run with full trace
yarn test:e2e --trace on

# Generate test report
yarn test:e2e:report
```

### Getting Help

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

## Test Maintenance

### Regular Maintenance Tasks

1. **Update selectors** when UI changes
2. **Add new test scenarios** for new features
3. **Review and remove obsolete tests**
4. **Keep utility functions updated**
5. **Monitor test execution times**

### Code Review Guidelines

- Ensure tests are deterministic (not flaky)
- Verify proper error handling
- Check for adequate waiting conditions
- Validate test descriptions are clear
- Confirm utility functions are used appropriately