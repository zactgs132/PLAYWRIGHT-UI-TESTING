import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com/');

    // Change theme to dark
    await page.locator('span', { hasText: ' Light' }).click();
    await page.locator('nb-option', { hasText: ' Dark' }).click();

    await page.getByText('Modal & Overlays').click();
    await page.getByText('Dialog').click();
});

test.skip('Auto-waiting', async ({ page }) => {
    const dialogWithDelayForm = page.locator('nb-card', { hasText: 'Open Dialog with delay' });
    await dialogWithDelayForm.getByRole('button', { name: '3 seconds' }).click();

    const dialogContainer = page.locator('nb-dialog-container');
    await dialogContainer.getByRole('button', { name: 'Ok' }).click();

    const dialogHeaderText = await dialogContainer.locator('nb-card-header').textContent();
    // .allTextContents() does not wait for the element to be visible
    // const dialogHeaderText = await dialogContainer.locator('nb-card-header').allTextContents();
    expect(dialogHeaderText).toEqual('Friendly reminder');
});

test('Alternative waits', async ({ page }, testInfo) => {
    // test.setTimeout(60000);
    // testInfo.setTimeout(testInfo.timeout + 30000);
    test.slow();

    const dialogWithDelayForm = page.locator('nb-card', { hasText: 'Open Dialog with delay' });
    await dialogWithDelayForm.getByRole('button', { name: '3 seconds' }).click();
    const dialogContainer = page.locator('nb-dialog-container');

    // Wait for the element
    // await dialogContainer.waitFor();
    // await page.waitForSelector('nb-dialog-container');

    // Wait for API response
    // await page.waitForResponse('**/delay/*');

    // Wait for load state (NOT RECOMMENDED)
    // await page.waitForLoadState('networkidle');

    // Hard wait (NEVER USE IT, EVER)
    // await page.waitForTimeout(3500);

    // const dialogHeaderText = await dialogContainer.locator('nb-card-header').allTextContents();
    // expect(dialogHeaderText).toContain('Friendly reminder');

    await expect(dialogContainer.locator('nb-card-header')).toHaveText('Friendly reminder', { timeout: 8000 });
});
