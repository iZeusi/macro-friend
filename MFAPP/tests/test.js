import { expect, test } from '@playwright/test';

test('food page has expected h1', async ({ page }) => {
	await page.goto('/about');
	await expect(page.locator('h1')).toHaveText('About this app');
});
