import { faker } from '@faker-js/faker';
import { test } from '../test-options';


test('Parametrized page object methods', async ({ pageManager }) => {
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(10)}@example.com`

    await pageManager.navigateTo.formLayoutsPage();
    await pageManager.formLayoutsPage.submitUsingTheGridForm('test@test.com', 'pass123', 'Option 1');
    await pageManager.formLayoutsPage.submitInlineForm(randomFullName, randomEmail, true);
})
