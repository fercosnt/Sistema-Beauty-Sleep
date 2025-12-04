import { test, expect } from '@playwright/test';

/**
 * IMPORTANT: Configure test credentials before running tests
 * 
 * Set environment variables:
 * - TEST_USER_EMAIL: Valid user email for testing
 * - TEST_USER_PASSWORD: Valid user password for testing
 * 
 * Or create a .env.test file with:
 * TEST_USER_EMAIL=admin@beautysmile.com
 * TEST_USER_PASSWORD=your_test_password
 * 
 * These credentials should be for a test user created in your Supabase Auth
 */
const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'admin@beautysmile.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword123';
const INVALID_EMAIL = 'invalid@test.com';
const INVALID_PASSWORD = 'wrongpassword';

// Skip tests that require authentication if credentials are not configured
const SKIP_AUTH_TESTS = !process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD;

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login');
  });

  test('should redirect to login when accessing dashboard without authentication', async ({ page }) => {
    // Try to access dashboard directly
    await page.goto('/dashboard');
    
    // Should be redirected to login page
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('login flow: valid credentials → dashboard', async ({ page }) => {
    // Verify credentials are configured
    if (SKIP_AUTH_TESTS) {
      test.skip(true, 'Test credentials not configured. Set TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables.');
      return;
    }
    
    // Wait for form to be ready
    await page.waitForSelector('input[name="email"]', { state: 'visible', timeout: 15000 });
    await page.waitForSelector('input[name="password"]', { state: 'visible', timeout: 5000 });
    
    // Fill in login form
    await page.fill('input[name="email"]', TEST_EMAIL);
    await page.fill('input[name="password"]', TEST_PASSWORD);
    
    // Wait a bit before submitting
    await page.waitForTimeout(500);
    
    // Submit form and wait for navigation
    await Promise.all([
      page.waitForURL(/.*\/dashboard/, { timeout: 20000 }),
      page.click('button[type="submit"]')
    ]);
    
    // Verify we're on the dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Wait for dashboard to load
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    
    // Verify dashboard content is visible (check for common dashboard elements)
    const dashboardContent = page.locator('text=Dashboard').or(page.locator('h1')).first();
    await expect(dashboardContent).toBeVisible({ timeout: 10000 });
  });

  test('login flow: invalid credentials → error message', async ({ page }) => {
    // Fill in login form with invalid credentials
    await page.fill('input[name="email"]', INVALID_EMAIL);
    await page.fill('input[name="password"]', INVALID_PASSWORD);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for error message to appear
    // Error message should be visible (check for error alert or message)
    const errorMessage = page.locator('text=/invalid|incorreto|erro|falha/i').first();
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    
    // Should still be on login page
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('login flow: empty fields → validation error', async ({ page }) => {
    // Try to submit form without filling fields
    await page.click('button[type="submit"]');
    
    // HTML5 validation should prevent submission
    // Check if email field has required attribute
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute('required', '');
    
    // Should still be on login page
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('logout flow: click logout → redirect to login', async ({ page }) => {
    // Verify credentials are configured
    if (SKIP_AUTH_TESTS) {
      test.skip(true, 'Test credentials not configured. Set TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables.');
      return;
    }
    
    // Wait for form to be ready
    await page.waitForSelector('input[name="email"]', { state: 'visible', timeout: 15000 });
    await page.waitForSelector('input[name="password"]', { state: 'visible', timeout: 5000 });
    
    // First, login
    await page.fill('input[name="email"]', TEST_EMAIL);
    await page.fill('input[name="password"]', TEST_PASSWORD);
    
    await page.waitForTimeout(500);
    
    // Submit and wait for navigation
    await Promise.all([
      page.waitForURL(/.*\/dashboard/, { timeout: 30000 }),
      page.click('button[type="submit"]')
    ]);
    
    // Wait for dashboard to load (more flexible)
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    
    // Find and click logout button
    // The logout button is in the Sidebar with text "Sair"
    // Try to find it directly first
    let logoutButton = page.locator('button').filter({ hasText: /^sair$/i }).or(
      page.locator('button:has-text("Sair")')
    );
    
    // Check if sidebar is visible (it should be on desktop, might need to open on mobile)
    const sidebarVisible = await page.locator('aside, nav').filter({ hasText: /sair/i }).isVisible({ timeout: 2000 }).catch(() => false);
    
    if (!sidebarVisible) {
      // On mobile, might need to open sidebar first
      const menuButton = page.locator('button[aria-label="Toggle menu"]').or(
        page.locator('button').filter({ hasText: /menu/i })
      );
      if (await menuButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await menuButton.click();
        await page.waitForTimeout(500); // Wait for sidebar to open
      }
    }
    
    // Now find and click the logout button
    logoutButton = page.locator('button').filter({ hasText: /^sair$/i }).first();
    await expect(logoutButton).toBeVisible({ timeout: 5000 });
    await logoutButton.click();
    
    // Wait for redirect to login
    await page.waitForURL(/.*\/login/, { timeout: 10000 });
    
    // Verify we're on login page
    await expect(page).toHaveURL(/.*\/login/);
    
    // Verify login form is visible
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('should show "Esqueci minha senha" link', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Check if password reset link is visible
    // The text is "Esqueceu sua senha?" in the page
    const resetLink = page.getByRole('button', { name: /esqueceu.*senha/i }).or(
      page.locator('button').filter({ hasText: /esqueceu.*senha/i })
    ).first();
    await expect(resetLink).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to password reset when clicking "Esqueci minha senha"', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Click password reset link
    // The text is "Esqueceu sua senha?" in the page
    const resetLink = page.getByRole('button', { name: /esqueceu.*senha/i }).or(
      page.locator('button').filter({ hasText: /esqueceu.*senha/i })
    ).first();
    await expect(resetLink).toBeVisible({ timeout: 5000 });
    await resetLink.click();
    
    // Wait for password reset form to appear
    await page.waitForTimeout(500);
    
    // Should show password reset form
    // Check for reset password heading "Recuperar Senha"
    await expect(page.getByRole('heading', { name: /recuperar senha/i })).toBeVisible({ timeout: 5000 });
  });
});

