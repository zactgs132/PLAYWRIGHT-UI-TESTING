import { Locator, Page } from "@playwright/test";

export class NavigationPage {

    // This is the recommended way use locators in Playwright but can easily become a nightmare when the page is worked on by multiple developers using different naming conventions and don't want to look through all of the listed locators
    private readonly page: Page
    private readonly formLayoutsMenu: Locator;
    private readonly datePickerMenu: Locator;
    private readonly toasterMenu: Locator;
    private readonly tooltipMenu: Locator;
    private readonly smartTableMenu: Locator;

    constructor(page: Page) {
        this.page = page
        this.formLayoutsMenu = page.getByRole('link', { name: 'Form Layouts' })
        this.datePickerMenu = page.getByText('Datepicker')
        this.toasterMenu = page.getByText('Toastr')
        this.tooltipMenu = page.getByText('Tooltip')
        this.smartTableMenu = page.getByText('Smart Table')
    }

    async formLayoutsPage() {
        await this.selectGroupMenuItem('Forms')
        await this.formLayoutsMenu.click();
    }

    async datePickerPage() {
        await this.selectGroupMenuItem('Forms')
        await this.datePickerMenu.click();
    }

    async toasterPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.toasterMenu.click();
    }

    async tooltipPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.tooltipMenu.click();
    }

    async smartTablePage() {
        await this.selectGroupMenuItem('Tables & Data')
        await this.page.getByText('Tables & Data').click();
        await this.smartTableMenu.click();
    }

    // This ensures that the menu item is clicked only if it is not currently expanded, keeping the relative child visible
    private async selectGroupMenuItem(groupMenuTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupMenuTitle);
        const expandedState = await groupMenuItem.getAttribute('aria-expanded');
        if (expandedState == 'false') {
            await groupMenuItem.click();
        }
    }
}