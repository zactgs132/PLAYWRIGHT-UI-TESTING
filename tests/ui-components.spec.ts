//'npm run ui-tests-chrome' in terminal. Script is set in package.json

import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Change theme to dark
    await page.locator('span', { hasText: ' Light' }).click();
    await page.locator('nb-option', { hasText: ' Dark' }).click();
});

test.describe('Form Layouts page', () => {
    test.describe.configure({ retries: 2 })
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    });

    test('Input fields', async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' });
        await usingTheGridEmailInput.fill('test@example.com');
        await usingTheGridEmailInput.clear();
        await usingTheGridEmailInput.pressSequentially('test2@test.com', { delay: 100 });

        // Extract the value
        const inputValue = await usingTheGridEmailInput.inputValue();

        // Assertions
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com');
        await expect(usingTheGridEmailInput).toHaveValue(/test.com/);
    });

    test('Radio buttons', async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', { hasText: 'Using the Grid' });

        await usingTheGridForm.getByLabel('Option 1').check({ force: true });
        // check({force: true}) bypasses the built-in wait for the element. In this example the element is 'visually-hidden' so the natural wait will never check the option
        await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).check({ force: true });

        // .isChecked() just returns a boolean and needs the assertion on the value
        const radioStatus = await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).isChecked();
        expect(radioStatus).toBeTruthy();

        // .toBeChecked() performs the assertion on the element
        await expect(usingTheGridForm.getByRole('radio', { name: 'Option 2' })).toBeChecked();
        await expect(usingTheGridForm.getByRole('radio', { name: 'Option 1' })).not.toBeChecked();
    });
});


test('Checkboxes', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();

    // .check will not interact with the element if it is already checked
    await page.getByRole('checkbox', { name: 'Hide on click' }).check({ force: true })
    // .click will interact with the element whether it is checked or not, it doesn't care, it just interacts
    await page.getByRole('checkbox', { name: 'Hide on click' }).click({ force: true })

    // Interact with all checkboxes
    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()) {
        await box.uncheck({ force: true })
        await expect(box).not.toBeChecked();
    }
});

test('Lists and dropdowns', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();

    // Standard dropdown
    await page.getByRole('combobox').selectOption('info');
    await page.locator('.form-group', { hasText: 'Toast type:' }).getByRole('combobox').selectOption('success');
    await expect(page.getByRole('combobox')).toHaveValue('success')

    // Custom dropdowns
    await page.locator('.form-group', { hasText: 'Position:' }).locator('nb-select').click();
    // Option 1
    await page.getByRole('list').getByText('bottom-end').click();
    // // Option 2
    // await page.locator('nb-option', { hasText: 'bottom-end' }).click()
    await expect(page.locator('.form-group', { hasText: 'Position:' }).locator('nb-select')).toHaveText('bottom-end')

    // Loop through list
    const positionDropDownField = page.locator('.form-group', { hasText: 'Position:' }).locator('nb-select');
    await positionDropDownField.click();
    const allListValues = await page.locator('nb-option').allTextContents();
    for (const listValue of allListValues) {
        await page.locator('nb-option', { hasText: listValue }).click();
        await expect(positionDropDownField).toHaveText(listValue);
        // Need to click the dropdown again to continue iterating over the loop
        await positionDropDownField.click();
    }
});

test('Tooltips', async ({ page }) => {
    // Use F8 (Windows) to freeze the DOM to inspect it
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click();

    await page.getByRole('button', { name: 'Top' }).hover();
    await expect(page.getByRole('tooltip')).toHaveText('This is a tooltip')
});

test('Dialog box', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?');
        dialog.accept()
    })

    await page.locator('tr', { hasText: 'mdo@gmail.com' }).locator('.nb-trash').click();
    await expect(page.locator('tr', { hasText: 'mdo@gmail.com' })).not.toBeVisible();
});

test('Web tables', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    // How to select row by any visible text
    const tableRowByEmail = page.getByRole('row', { name: 'twitter@outlook.com' })
    await tableRowByEmail.locator('.nb-edit').click();
    await tableRowByEmail.getByPlaceholder('Age').fill('35');
    await tableRowByEmail.locator('.nb-checkmark').click();
    await expect(tableRowByEmail.locator('td').last()).toHaveText('35')

    // Select row by specific column value
    const tableRowById = page.getByRole('row').filter({ has: page.getByRole('cell').nth(1).getByText('10') });
    await tableRowById.locator('.nb-edit').click();
    await page.locator('tbody').getByPlaceholder('E-mail').fill('test@test.com');
    await page.locator('tbody').locator('.nb-checkmark').click();
    await expect(tableRowById.locator('td').nth(5)).toHaveText('test@test.com')

    // Loop through table rows
    const ages = ['20', '30', '40', '200'];

    for (let age of ages) {
        await page.getByPlaceholder('Age').fill(age);

        if (age == '200') {
            await expect(page.locator('tbody')).toContainText('No data found');
        } else {
            await expect(page.locator('tbody tr').first().locator('td').last()).toHaveText(age);
            const allTableRows = await page.locator('tbody tr').all();
            for (let row of allTableRows) {
                await expect(row.locator('td').last()).toHaveText(age);
            };
        };
    };
});

test('Date picker', async ({ page }) => {
    await page.getByText('Forms').click();
    await page.getByText('Datepicker').click();

    const calendarInputField = page.getByPlaceholder('Form Picker');
    await calendarInputField.click();

    // Use dynamic date so test is not flakey
    const date = new Date();
    date.setDate(date.getDate() + 50);
    const expectedDay = date.getDate().toString();
    const expectedMonth = date.toLocaleString('En-US', { month: 'short' });
    const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' });
    const expectedYear = date.getFullYear();
    const expectedDate = `${expectedMonth} ${expectedDay}, ${expectedYear}`

    // Iterate over the months until the expected month/year is shown
    let currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`;
    while (!currentMonthAndYear?.includes(expectedMonthAndYear)) {
        await page.locator('.next-month').click();
        currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    };

    // { exact: true } makes sure that single digit days don't return multiple values i.e. 2: 2, 12, 21, 22, etc.
    await page.locator('.day-cell:not(.bounding-month)').getByText(expectedDay, { exact: true }).click();
    await expect(calendarInputField).toHaveValue(expectedDate)
});

test('Sliders', async ({ page }) => {
    // 1. Setting the attribute values
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger');

    await tempGauge.evaluate(element => {
        element.setAttribute('cx', '232.630')
        element.setAttribute('cy', '232.630')
    });
    await tempGauge.click();
    // Just to visually check that the gauge is set to max in previous code, this is not necessary for test
    // await page.waitForTimeout(500);
    await expect.soft(tempBox).toContainText('30');

    // 2. Mouse movement
    await tempBox.scrollIntoViewIfNeeded();

    const box = await tempBox.boundingBox();
    // @ts-ignore
    const x = box?.x + box?.width / 2
    // @ts-ignore
    const y = box?.y + box?.height / 2
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x - 100, y);
    await page.mouse.move(x - 100, y + 200);
    await page.mouse.up();
    await expect(tempBox).toContainText('12');
});

test('iFrames', async ({ page }) => {
    test.setTimeout(10000);

    // iFrame is essentially a different html document linked into the DOM. The inner elements are not inherently visible 
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Dialog').click();

    const frameLocator = page.frameLocator('[data-cy="esc-close-iframe"]');
    await frameLocator.getByRole('button', { name: 'Open Dialog with esc close' }).click();
});

test('Drag & drop', async ({ page }) => {
    await page.getByText('Extra Components').click();
    await page.getByText('Drag & Drop').click();
    // 1
    await page.getByText('Clean my room').dragTo(page.locator('#drop-list'));

    // 2
    await page.getByText('Get groceries').hover();
    await page.mouse.down();
    await page.locator('#drop-list').hover();
    await page.mouse.up();

});