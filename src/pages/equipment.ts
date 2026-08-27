import { test, expect, Locator, Page } from "@playwright/test";
import { MenuPage } from '@menuPage';

export class Equipment {

    private page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Communication state
     */
    async commState(stateValue: string, option: string) {
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
        
        if (option == "ok") {
            // command 팝업 OK 클릭
            await this.page.getByRole('button', { name: 'OK', exact: true }).click();
        } else if (option == "cancel") {
            // command 팝업 Cancel 클릭
            await this.page.getByRole('button', { name: 'Cancel', exact: true }).click();
        } else if (option == "none") {
            // 아무것도 클릭하지 않고 팝업 유지
        } else {
            // ❌ 실패 처리 후 즉시 함수를 종료하도록 return 추가
            test.fail(true, `유효하지 않은 option이 입력되었습니다: '${option}'. ('ok', 'cancel', 'none' 만 가능)`);
            return;
        }
    }

    /**
     * Control state
     */
    async conState(stateValue: string, option: string) {
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

        if (option == "ok") {
            // command 팝업 OK 클릭
            await this.page.getByRole('button', { name: 'OK', exact: true }).click();
        } else if (option == "cancel") {
            // command 팝업 Cancel 클릭
            await this.page.waitForTimeout(2500);
            await this.page.getByRole('button', { name: 'Cancel', exact: true }).click();
        } else if (option == "none") {
            // 아무것도 클릭하지 않고 팝업 유지
        } else {
            // ❌ 실패 처리 후 즉시 함수를 종료하도록 return 추가
            test.fail(true, `유효하지 않은 option이 입력되었습니다: '${option}'. ('ok', 'cancel', 'none' 만 가능)`);
            return;
        }
    }

    /**
     * Equipment state
     */
    async equipState(equipParam: string, equipValue: string, option: string) {
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
        if (option == "ok") {
            // command 팝업 OK 클릭
            await this.page.getByRole('button', { name: 'OK', exact: true }).click();
        } else if (option == "cancel") {
            // command 팝업 Cancel 클릭
            await this.page.getByRole('button', { name: 'Cancel', exact: true }).click();
        } else if (option == "none") {
            // 아무것도 클릭하지 않고 팝업 유지
        } else {
            // ❌ 실패 처리 후 즉시 함수를 종료하도록 return 추가
            test.fail(true, `유효하지 않은 option이 입력되었습니다: '${option}'. ('ok', 'cancel', 'none' 만 가능)`);
            return;
        }

    }

    /**
     * Service state 확인
     */
    async serviceState(serviceParam: string, option: string) {
        const menuPage = new MenuPage(this.page);
        // 원형 버튼들을 감싸고 있는 <ul> 영역을 선택
        // (속성 이름과 가변적인 flex 관련 클래스들을 조합하여 유일한 영역을 지정)
        const circleListArea = this.page.locator('ul.flex.gap-\\[6\\px\\]');

        if (serviceParam == "all" && option == "on") {
            // 전체 service on 확인
            await expect(circleListArea).toHaveScreenshot('all_service_on.png', { timeout: 5000 });
        } else if (serviceParam == "all" && option == "off") {
            // control 페이지 진입
            await menuPage.navigateTo('control');

            // 전체 service off 확인
            await expect(circleListArea).toHaveScreenshot('all_service_off.png', { timeout: 5000 }); 
        } else {
            // ❌ 실패 처리 후 즉시 함수를 종료하도록 return 추가
        }
        
        
    }
}