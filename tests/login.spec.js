const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://staging-leadmanager.automateleads.ai/auth/login';
const VALID_EMAIL = 'dileep+5@careersocially.com';
const VALID_PASSWORD = '123456';

test.describe('Login Screen', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
    });

    test('should display login form elements', async ({ page }) => {
        await expect(page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in")')).toBeVisible();
    });

    // test('should show error on empty form submission', async ({ page }) => {
    //     await page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in")').first().click();
    //     // Expect either a validation message or an error alert to appear
    //     const errorVisible = await page.locator('[role="alert"], .error, .error-message, [class*="error"]').first().isVisible().catch(() => false);
    //     const htmlValidation = await page.locator('input:invalid').count();
    //     expect(errorVisible || htmlValidation > 0).toBeTruthy();
    // });

    test('should show error on invalid credentials', async ({ page }) => {
        await page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first().fill('wrong@example.com');
        await page.locator('input[type="password"]').first().fill('wrongpassword');
        await page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in")').first().click();

        await expect(
            page.locator('[role="alert"], .error, .error-message, [class*="error"], [class*="invalid"]').first()
        ).toBeVisible({ timeout: 5000 });
    });

    test('should mask password input', async ({ page }) => {
        const passwordInput = page.locator('input[type="password"]').first();
        await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('should navigate to dashboard on valid login', async ({ page }) => {
        await page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first().fill(VALID_EMAIL);
        await page.locator('input[type="password"]').first().fill(VALID_PASSWORD);
        await page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in")').first().click();

        // After login the URL should change away from the login page
        await expect(page).not.toHaveURL(BASE_URL, { timeout: 8000 });
    });

});
