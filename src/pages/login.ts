import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {

    private page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * 로그인 
     */
    async login(id: string, pw: string) {
        // ID 입력
        await this.page.getByPlaceholder('ID').fill(id);
        // Password 입력
        await this.page.getByPlaceholder('Password').fill(pw);
        // login 버튼 클릭
        await this.page.getByRole('button', { name: 'Login', exact: true }).click();
        // 로그인 성공 확인
        await expect(this.page.getByText('Welcome to Conveyor Control System', { exact: true })).toBeVisible({ timeout: 5000 });
    }

    /**
     * 로그아웃
     */
    async logout() {
        // logout 버튼 클릭
        await this.page.getByRole('button', { name: 'Logout', exact: true }).click();
        // 로그아웃 확인
        await expect(this.page.getByRole('button', { name: 'Login', exact: true })).toBeVisible({ timeout: 5000 });
    }
}