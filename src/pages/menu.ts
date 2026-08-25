import { expect, Locator, Page } from "@playwright/test";

export class MenuPage {

    private page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * 메뉴
     */
    async navigateTo(menuName: string) {
        // 메뉴 이동
        await this.page.locator(`li[title="${menuName}"]`).click();
    }

}