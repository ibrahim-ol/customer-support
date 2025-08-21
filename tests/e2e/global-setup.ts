import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('Running global setup for Playwright tests...');

  // You can add global setup logic here such as:
  // - Database seeding
  // - Authentication setup
  // - Environment preparation

  // Example: Check if the server is running
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(config.webServer?.url || 'http://localhost:3000');
    console.log('✓ Server is accessible');
  } catch (error) {
    console.error('✗ Server is not accessible:', error);
    throw error;
  }

  await browser.close();

  console.log('Global setup completed successfully');
}

export default globalSetup;
