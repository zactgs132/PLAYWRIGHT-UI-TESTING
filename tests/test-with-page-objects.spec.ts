/** 
 * NOTES **
 * 
 * DRY - Don't Repeat Yourself *
 * Extract shared steps into resusable page methods instead of duplicating the same code across many tests
 *
 * KISS - Keep It Simple, Stupid *
 * Avoid generating boilerplate code. Every extra line should be reviewed and understood
 * 
 * Descriptive naming *
 * Name methods for what they do, so test read almost like plain English
 * 
 * Avoid tiny methods *
 * Don't wrap single lines in methods - group related steps into meaningful actions
 *  Function to login including Fill Email, Fill Password, Click Submit in a single function, rather than 3 individual functions to do one thing. 
 *  Saves lines and makes things precise
 * */

import { test } from '@playwright/test';
import { PageManager } from '../page-objects/page-manager';
import { faker } from '@faker-js/faker';

test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Change theme to dark
    await page.locator('span', { hasText: ' Light' }).click();
    await page.locator('nb-option', { hasText: ' Dark' }).click();
});

test('Navigate to form layouts page', async ({ page }) => {
    const pom = new PageManager(page)
    await pom.navigateTo.formLayoutsPage()
})

test('Parametrized page object methods', async ({ page }) => {
    const pom = new PageManager(page)
    const randomFullName = faker.person.fullName()
    // const randomEmail = faker.internet.email()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(10)}@example.com`

    await pom.navigateTo.formLayoutsPage();
    await pom.formLayoutsPage.submitUsingTheGridForm('test@test.com', 'pass123', 'Option 1');
    await page.screenshot({ path: 'screenshots/formsLayoutsPage.png' })
    const buffer = await page.screenshot()
    // console.log(buffer.toString('base64'))
    await pom.formLayoutsPage.submitInlineForm(randomFullName, randomEmail, true);
    await page.locator('nb-card', { hasText: 'Inline form' }).screenshot({ path: 'screenshots/inlineForm.png' })
    await pom.navigateTo.datePickerPage();
    await pom.datepickerPage.selectCommonDatepickerDateFromToday(5);
    await pom.datepickerPage.selectDatePickerWithRangeFromToday(5, 10);
})
