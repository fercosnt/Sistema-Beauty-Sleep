import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Load environment variables from .env.test.local if it exists
 */
const envTestLocalPath = path.join(__dirname, '.env.test.local');
if (fs.existsSync(envTestLocalPath)) {
  const envFile = fs.readFileSync(envTestLocalPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './__tests__',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Only run Playwright test files, ignore Jest test files */
  testMatch: [
    '**/*.spec.ts',
    '**/integration/**/*.test.ts',
    '!**/utils/**/*.test.ts', // Ignore Jest unit tests
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'integration',
      testMatch: '**/integration/**/*.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'e2e',
      testMatch: '**/e2e/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    // Default project runs all tests
    {
      name: 'chromium',
      testMatch: [
        '**/*.spec.ts',
        '**/integration/**/*.test.ts',
        '!**/utils/**/*.test.ts', // Ignore Jest unit tests
      ],
      use: { ...devices['Desktop Chrome'] },
    },

    // Uncomment to test in other browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});

