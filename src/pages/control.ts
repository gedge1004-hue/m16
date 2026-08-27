import { test, expect, Locator, Page } from "@playwright/test";
import { MenuPage } from '@menuPage';
import { LoginPage } from '@login';

export class Control {

    private page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    async controlTCM(serviceName: string, tcmName: string, option: string) {

        // [안전장치] on, off 외에 엉뚱한 값이 들어오면 테스트를 즉시 실패 처리
        if (option !== "on" && option !== "off") {
            test.fail(true, `유효하지 않은 option이 입력되었습니다: '${option}'. ('on' 또는 'off'만 가능)`);
            return;
        }

        // 문자열 비교 상태를 동적으로 정의
        const targetStatus = option === "on" ? "true" : "false";

        // 두 번째 테이블 요소를 잡고 화면에 보일 때까지 최대 5초 대기
        const secondTable = this.page.locator('.el-table--fit').nth(1);
        await expect(secondTable).toBeVisible({ timeout: 5000 });

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
    
    async controlService(serviceName: string, option: string) {
        // 입력값 검증
        if (option !== "on" && option !== "off") {
            test.fail(true, `유효하지 않은 option이 입력되었습니다: '${option}'. ('on' 또는 'off'만 가능)`);
            return;
        }

        const targetStatus = option === "on" ? "true" : "false";

        // 첫 번째 테이블 요소를 잡고 화면에 보일 때까지 최대 5초 대기
        const serviceTable = this.page.locator('.el-table--fit').first();
        await expect(serviceTable).toBeVisible({ timeout: 5000 });

        // 지정한 서비스명(예: 'DCM')을 가진 행(Row) 조준
        const targetRow = serviceTable.locator('tr.el-table__row', { hasText: serviceName });
        
        // 행이 존재하는지 확인
        const isRowVisible = await targetRow.isVisible();
        if (!isRowVisible) {
            test.fail(true, `테이블에서 서비스명 '${serviceName}'을 찾을 수 없습니다.`);
            return;
        }

        // 해당 행 내부에 스위치 엘리먼트가 존재하는지 확인 (CUS처럼 '-' 표시가 된 행 방어)
        const switchCore = targetRow.locator('.el-switch__core');
        const hasSwitch = await switchCore.isVisible();

        if (!hasSwitch) {
            console.log(`[안내] '${serviceName}' 서비스는 스위치가 제공되지 않는 항목입니다. (패스)`);
            return;
        }

        // 스위치 상태 체크 및 조작 진행
        const switchInput = targetRow.locator('input.el-switch__input');
        await expect(switchCore).toBeVisible({ timeout: 3000 });
        await expect(switchCore).toBeEnabled();

        const isChecked = await switchInput.getAttribute('aria-checked');
        
        // 원하는 상태와 다를 때만 클릭하여 ON/OFF 전환
        if (isChecked !== targetStatus) {
            await switchCore.click();
            
            // 상태가 바뀔 때까지 최대 8초간 대기하며 검증
            await expect(switchInput).toHaveAttribute('aria-checked', targetStatus, { timeout: 8000 });
        }
    }
}