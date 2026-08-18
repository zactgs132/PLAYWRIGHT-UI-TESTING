import { test, expect } from '@playwright/test';

// This entire page was created using 'Playwright > Record new' from the 'Testing' tab

test('test', async ({ page }) => {
  await page.goto('https://playground.bondaracademy.com/pages/iot-dashboard');
  await page.getByRole('button', { name: 'Light' }).click();
  await page.getByText('Dark').click();
  await page.getByRole('link', { name: 'Forms' }).click();
  await page.getByRole('link', { name: 'Form Layouts' }).click();
  await page.getByRole('textbox', { name: 'Jane Doe' }).fill('Jimothy Bimblesnap');
  await page.locator('form').filter({ hasText: 'Remember meSubmit' }).getByPlaceholder('Email').fill('jb@example.com');
  await page.locator('.custom-checkbox').first().click();
  await page.locator('form').filter({ hasText: 'Remember meSubmit' }).getByRole('button').click();
});