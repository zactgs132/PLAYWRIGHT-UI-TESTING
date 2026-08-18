import { test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com/');
});

test.describe('Suite 1', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
    });

    test('This is a first test', async ({ page }) => {
        await page.getByRole('link', { name: 'Form Layouts' }).click();
    });

    test('This is a first test to datepicker', async ({ page }) => {
        await page.getByRole('link', { name: 'Datepicker' }).click();
    });
});

test.describe('Suite 2', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Extra Components').click();
    });

    test('This is a first test', async ({ page }) => {
        await page.getByRole('link', { name: 'Calendar' }).click();
    });

    test('This is a first test to datepicker', async ({ page }) => {
        await page.getByRole('link', { name: 'PDF Download' }).click();
    });
});

