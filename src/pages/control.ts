import { test, expect, Locator, Page } from "@playwright/test";
import { MenuPage } from '@menuPage';
import { LoginPage } from '@login';

export class Control {

    private page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    async control(serviceName: string, tcmName: string, option: string) {
        const id = 'tester';
        const pw = 'tester';
        const menuName = 'control';
        const loginPage = new LoginPage(this.page);
        const menuPage = new MenuPage(this.page);

        // 로그인 진행
        await loginPage.login(id, pw);
        await menuPage.navigateTo(menuName);

        // [안전장치] on, off 외에 엉뚱한 값이 들어오면 테스트를 즉시 실패 처리
        if (option !== "on" && option !== "off") {
            test.fail(true, `유효하지 않은 option이 입력되었습니다: '${option}'. ('on' 또는 'off'만 가능)`);
            return;
        }

        // 문자열 비교 상태를 동적으로 정의
        const targetStatus = option === "on" ? "true" : "false";

        if (serviceName === "TCM_ALL") {
            const secondTable = this.page.locator('.el-table--fit').nth(1);
            const rows = secondTable.locator('tr.el-table__row');
            const rowCount = await rows.count();

            for (let i = 0; i < rowCount; i++) {
                const currentRow = rows.nth(i);
                const switchInput = currentRow.locator('input.el-switch__input');
                const switchCore = currentRow.locator('.el-switch__core');

                const isChecked = await switchInput.getAttribute('aria-checked');
                
                // 원하는 상태와 다를 때만 클릭
                if (isChecked !== targetStatus) {
                    await switchCore.click();
                    await expect(switchInput).toHaveAttribute('aria-checked', targetStatus, { timeout: 8000 });
                }
            }
        } else if (serviceName === "TCM_single") {
            const secondTable = this.page.locator('.el-table--fit').nth(1);
            const targetRow = secondTable.locator('tr.el-table__row', { hasText: tcmName });            
            const switchInput = targetRow.locator('input.el-switch__input');
            const switchCore = targetRow.locator('.el-switch__core');

            const isChecked = await switchInput.getAttribute('aria-checked');
            
            // 원하는 상태와 다를 때만 클릭
            if (isChecked !== targetStatus) {
                await switchCore.click();
                await expect(switchInput).toHaveAttribute('aria-checked', targetStatus, { timeout: 8000 });
            }
        }
    }
    

}