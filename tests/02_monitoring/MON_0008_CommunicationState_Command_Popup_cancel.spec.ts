import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { Equipment } from '@equipment';

test('MON_0008 Communication state - Command popup cancel', async ({ page }) => {

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const equipment = new Equipment(page);

    // GUI 진입
    await common.goto();
    // 언어 변경(US)    
    await common.changeLanguage('us');
    // 로그인 진행
    await loginPage.login('tester', 'tester');
    // Monitoring 페이지 진입
    await menuPage.navigateTo('monitoring');
    // Communication State command 팝업 열기 (미선택)
    await equipment.commState('none', 'none');
    // Communication State command 팝업 영역
    const commandPopup = page.locator('.el-dialog__body');
    // communication command-popup 비교
    await expect(commandPopup).toHaveScreenshot('Communication-state-command-popup.png', {
        maxDiffPixelRatio: 0.05, // 팝업의 미세한 렌더링 오차 방지 (5% 허용)
        threshold: 0.2
    });
    // 팝업 내 Cancel 클릭
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    // communication state 값 영역
    const stateValueBox = page.locator('.state-row').first().locator('.state-value');
    // communication command-popup 취소 후 communication state 값 비교
    await expect(stateValueBox).toHaveScreenshot('communication_default_state.png', {
        maxDiffPixelRatio: 0.05, // communication state 값의 미세한 렌더링 오차 방지 (5% 허용)
        threshold: 0.2
    });
});
