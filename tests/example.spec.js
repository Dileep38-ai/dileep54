const { test, expect } = require('@playwright/test');

test('Open browser and verify page title', async ({ page }) => {
    await page.goto('https://staging-leadmanager.automateleads.ai/');

    // Verify page title
    await expect(page).toHaveTitle(/dileep/);

    // Verify text on page
    // await expect(page.locator('h1')).toHaveText('Example Domain');
});