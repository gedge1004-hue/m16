import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { Equipment } from '@equipment';

test('MON_0011 Communication state - Communication disabled', async ({ page }) => {

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
    // Communication State command > disable > ok 클릭
    await equipment.commState('disable', 'ok');
    // communication state 값 영역
    const stateValueBox = page.locator('.state-row').first().locator('.state-value');
    // Disabled 및 배경까지 이미지 비교
    await expect(stateValueBox).toHaveScreenshot('disabled_state.png');
});
