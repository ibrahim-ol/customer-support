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
└── example.spec.ts    # Example test file (to be replaced)
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

## Troubleshooting

### Common Issues

1. **Server not starting**: Check that `yarn start` works manually
2. **Element not found**: Ensure elements have proper selectors or data-testids
3. **Timing issues**: Use Playwright's auto-waiting instead of manual waits
4. **Flaky tests**: Add proper waiting conditions and avoid hard-coded delays

### Getting Help

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)