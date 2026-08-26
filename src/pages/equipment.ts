import { test, expect, Locator, Page } from "@playwright/test";

export class Equipment {

    private page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Communication state
     */
    async commState(stateValue: string, yn: string) {
        // 기본 값으로 시작
        const commState = this.page.locator('.state-row').first();
        await commState.click();
        await this.page.locator('.el-check-tag', { hasText: 'Enable' }).click();
        await this.page.getByRole('button', { name: 'OK', exact: true }).click();

        // Communication State 클릭하여 command 팝업 띄우기       
        await commState.click();
        
        // Communication State command 팝업 확인
        await expect(this.page.getByRole('heading', { name: 'Communication State Command', exact: true })).toBeVisible({ timeout: 5000 });
        
        if (stateValue == "enable") {
            // Enable 클릭
            await this.page.locator('.el-check-tag', { hasText: 'Enable' }).click();
        } else if (stateValue == "disable") {
            // Disable 클릭
            await this.page.locator('.el-check-tag', { hasText: 'Disable' }).click();
        } else if (stateValue == "none") {
            // 아무것도 클릭하지 않고 팝업 유지 상태
        } else {
            // ❌ 실패 처리 후 즉시 함수를 종료하도록 return 추가
            test.fail(true, `유효하지 않은 stateValue가 입력되었습니다: '${stateValue}'. ('enable' 또는 'disable' 또는 'none' 만 가능)`);
            return;
        }
        
        if (yn == "y") {
            // command 팝업 OK 클릭
            await this.page.getByRole('button', { name: 'OK', exact: true }).click();
        } else if (yn == "n") {
            // command 팝업 Cancel 클릭
            await this.page.getByRole('button', { name: 'Cancel', exact: true }).click();
        } else if (yn == "none") {
            // 아무것도 클릭하지 않고 팝업 유지
        } else {
            // ❌ 실패 처리 후 즉시 함수를 종료하도록 return 추가
            test.fail(true, `유효하지 않은 yn가 입력되었습니다: '${yn}'. ('y', 'n', 'none' 만 가능)`);
            return;
        }
    }

    /**
     * Control state
     */
    async conState(stateValue: string, yn: string) {
        // 기본 값으로 시작
        const commState = this.page.locator('.state-row').nth(1);
        await commState.click();
        await this.page.locator('.el-check-tag', { hasText: 'ONLINE-LOCAL' }).click();
        await this.page.getByRole('button', { name: 'OK', exact: true }).click();

        // Control State 클릭하여 command 팝업 띄우기
        await commState.click();

        // Control State command 팝업 확인
        await expect(this.page.getByRole('heading', { name: 'Control State Command', exact: true })).toBeVisible({ timeout: 5000 });

        if (stateValue == "none") {
            // 아무것도 클릭하지 않고 팝업 유지
        } else if (stateValue == "offline") {
            // OFFLINE 클릭
            await this.page.locator('.el-check-tag', { hasText: 'OFFLINE' }).click();
        } else if (stateValue == "onLocal") {
            // ONLINE-LOCAL 클릭
            await this.page.locator('.el-check-tag', { hasText: 'ONLINE-LOCAL' }).click();
        } else if (stateValue == "onRemote") {
            // Online-Remote 클릭
            await this.page.locator('.el-check-tag', { hasText: 'Online-Remote' }).click();
        } else {
            // ❌ 실패 처리 후 즉시 함수를 종료하도록 return 추가
            test.fail(true, `유효하지 않은 stateValue가 입력되었습니다: '${stateValue}'. ('none' 또는 'offline' 또는 'onLocal' 또는 'onRemote' 만 가능)`);
            return;
        }

        if (yn == "y") {
            // command 팝업 OK 클릭
            await this.page.getByRole('button', { name: 'OK', exact: true }).click();
        } else if (yn == "n") {
            // command 팝업 Cancel 클릭
            await this.page.getByRole('button', { name: 'Cancel', exact: true }).click();
        } else if (yn == "none") {
            // 아무것도 클릭하지 않고 팝업 유지
        } else {
            // ❌ 실패 처리 후 즉시 함수를 종료하도록 return 추가
            test.fail(true, `유효하지 않은 yn가 입력되었습니다: '${yn}'. ('y', 'n', 'none' 만 가능)`);
            return;
        }
    }

    /**
     * Equipment state
     */
    async equipState(equipParam: string, equipValue: string, yn: string) {
        // equipment info
        const equipValueLocator = this.page.locator('.value-box');

        // 입력할 파라미터 클릭
        if (equipParam == "model") {   
            await equipValueLocator.first().click();
        } else if (equipParam == "name") {
            await equipValueLocator.nth(1).click();
        } else if (equipParam == "timeout") {
            await equipValueLocator.nth(2).click();
        } else {
            // ❌ 실패 처리 후 즉시 함수를 종료하도록 return 추가
            test.fail(true, `유효하지 않은 equipParam이 입력되었습니다: '${equipParam}'. ('model' 또는 'name' 또는 'timeout' 만 가능)`);
            return;
        }

        // 값 입력
        if (equipValue == "none" || equipValue == "") {

        } else {
            // 값 입력
            const inputField = this.page.locator('.el-input__inner').nth(1);
            await inputField.click();
            await inputField.fill(equipValue);
        }
        
        // 버튼 클릭
        if (yn == "y") {
            // command 팝업 OK 클릭
            await this.page.getByRole('button', { name: 'OK', exact: true }).click();
        } else if (yn == "n") {
            // command 팝업 Cancel 클릭
            await this.page.getByRole('button', { name: 'Cancel', exact: true }).click();
        } else if (yn == "none") {
            // 아무것도 클릭하지 않고 팝업 유지
        } else {
            // ❌ 실패 처리 후 즉시 함수를 종료하도록 return 추가
            test.fail(true, `유효하지 않은 yn가 입력되었습니다: '${yn}'. ('y', 'n', 'none' 만 가능)`);
            return;
        }

    }
}