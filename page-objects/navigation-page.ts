import { Page } from "@playwright/test";
import { step } from "../helpers/test-step-decorator";
import { HelperBase } from "./helper-base";

export class NavigationPage extends HelperBase {

    constructor(page: Page) {
        super(page);
    };

    @step
    async formLayoutsPage() {
        await this.selectGroupMenuItem('Forms')
        await this.page.getByRole('link', { name: 'Form Layouts' }).click();
    }
    @step
    async datePickerPage() {
        await this.selectGroupMenuItem('Forms')
        await this.page.getByText('Datepicker').click();
    }
    @step
    async toasterPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Toastr').click();
    }
    @step
    async tooltipPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Tooltip').click();
    }
    @step
    async smartTablePage() {
        await this.selectGroupMenuItem('Tables & Data')
        await this.page.getByText('Tables & Data').click();
        await this.page.getByText('Smart Table').click();
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