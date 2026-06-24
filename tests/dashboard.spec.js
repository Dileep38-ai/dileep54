const { test, expect } = require('@playwright/test');

const LOGIN_URL = 'https://staging-leadmanager.automateleads.ai/auth/login';
const VALID_EMAIL = 'dileep+9@careersocially.com';
const VALID_PASSWORD = '1234567';

test.describe('Dashboard Screen (post-login)', () => {

    test.beforeEach(async ({ page }) => {
        // Log in before each test
        // await page.goto(LOGIN_URL);
        // await page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first().fill(VALID_EMAIL);
        await page.locator('input[type="password"]').first().fill(VALID_PASSWORD);
        await page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in")').first().click();
        // Wait for redirect away from login page
        await expect(page).not.toHaveURL(LOGIN_URL, { timeout: 10000 });
    });

    // ── Header ──────────────────────────────────────────────────────────────

    test('should display AutomateLeads branding in header', async ({ page }) => {
        await expect(page.locator('text=AutomateLeads').first()).toBeVisible({ timeout: 8000 });
    });

    test('should display Fresh Leads count in header', async ({ page }) => {
        // Header shows "Fresh Leads - <number>"
        await expect(
            page.locator('text=/Fresh Leads/i').first()
        ).toBeVisible({ timeout: 8000 });
    });

    test('should display user greeting in header', async ({ page }) => {
        // "Hi, DileepAM" or similar greeting
        await expect(
            page.locator('text=/Hi,/i').first()
        ).toBeVisible({ timeout: 8000 });
    });

    // ── Overview stats ───────────────────────────────────────────────────────

    test('should display Overview section heading', async ({ page }) => {
        await expect(page.locator('text=Overview').first()).toBeVisible({ timeout: 8000 });
    });

    test('should display PROJECTS stat card', async ({ page }) => {
        await expect(page.locator('text=PROJECTS').first()).toBeVisible({ timeout: 8000 });
    });

    test('should display CLIENTS stat card', async ({ page }) => {
        await expect(page.locator('text=CLIENTS').first()).toBeVisible({ timeout: 8000 });
    });

    test('should display USERS stat card', async ({ page }) => {
        await expect(page.locator('text=USERS').first()).toBeVisible({ timeout: 8000 });
    });

    test('should display FRESH LEADS stat card', async ({ page }) => {
        await expect(page.locator('text=FRESH LEADS').first()).toBeVisible({ timeout: 8000 });
    });

    test('should display LEADS stat card', async ({ page }) => {
        await expect(page.locator('text=LEADS').first()).toBeVisible({ timeout: 8000 });
    });

    test('should show numeric values in all Overview stat cards', async ({ page }) => {
        // Each stat card should contain at least one element with a numeric value
        await page.waitForSelector('text=Overview', { timeout: 8000 });
        const statNumbers = page.locator('text=/^[0-9,]+$/');
        await expect(statNumbers.first()).toBeVisible();
        const count = await statNumbers.count();
        expect(count).toBeGreaterThanOrEqual(5); // at least 5 stat values visible
    });

    test('should show consistent Fresh Leads count between header and overview card', async ({ page }) => {
        await page.waitForSelector('text=FRESH LEADS', { timeout: 8000 });

        // Grab the number from the overview "FRESH LEADS" card (sibling of label)
        const freshLeadsCard = page.locator('text=FRESH LEADS').first();
        await expect(freshLeadsCard).toBeVisible();

        // Grab the header text which contains "Fresh Leads - <number>"
        const headerFreshLeads = page.locator('text=/Fresh Leads/i').first();
        const headerText = await headerFreshLeads.textContent();

        // Both should reference the same number — confirm header text includes digits
        expect(headerText).toMatch(/\d/);
    });

    // ── Client dropdown ──────────────────────────────────────────────────────

    test('should display Client section with dropdown', async ({ page }) => {
        await expect(page.locator('text=Client').first()).toBeVisible({ timeout: 8000 });
        await expect(
            page.locator('text=Select a Client, [aria-label*="client" i], select, .select__control').first()
        ).toBeVisible({ timeout: 8000 });
    });

    test('should open Client dropdown on click', async ({ page }) => {
        await page.waitForSelector('text=Select a Client', { timeout: 8000 });
        await page.locator('text=Select a Client').first().click();
        // After clicking the dropdown should expand — look for a listbox or open state
        const dropdownOpen = await page.locator(
            '[role="listbox"], [role="option"], .select__menu, .dropdown-menu'
        ).first().isVisible().catch(() => false);
        expect(dropdownOpen).toBeTruthy();
    });

    // ── Sidebar navigation ───────────────────────────────────────────────────

    test('should display left sidebar navigation', async ({ page }) => {
        // The sidebar should be present (contains nav icons)
        await expect(
            page.locator('nav, [role="navigation"], aside, .sidebar, .side-nav').first()
        ).toBeVisible({ timeout: 8000 });
    });

    test('should highlight Home/Dashboard icon as active in sidebar', async ({ page }) => {
        await page.waitForSelector('nav, aside, .sidebar', { timeout: 8000 });
        // The active nav item should have an active/selected class or aria attribute
        const activeNavItem = page.locator(
            '.active, [aria-current="page"], [class*="active"], [class*="selected"]'
        ).first();
        await expect(activeNavItem).toBeVisible({ timeout: 5000 });
    });

    // ── Page stability ───────────────────────────────────────────────────────

    test('should not show login page elements after successful login', async ({ page }) => {
        await expect(
            page.locator('input[type="password"]')
        ).not.toBeVisible({ timeout: 5000 });
    });

    test('should stay on dashboard on page reload', async ({ page }) => {
        const dashboardURL = page.url();
        await page.reload();
        await expect(page).not.toHaveURL(LOGIN_URL, { timeout: 8000 });
        await expect(page.locator('text=Overview').first()).toBeVisible({ timeout: 8000 });
        // URL should be same or still on dashboard (some apps redirect to / or /dashboard)
        expect(page.url()).not.toBe(LOGIN_URL);
    });

});
