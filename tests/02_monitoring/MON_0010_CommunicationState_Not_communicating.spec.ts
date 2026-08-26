import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';

test('MON_0010 Communication state - Not Communicating', async ({ page }) => {

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);

    // GUI 진입
    await common.goto();
    // 언어 변경(US)    
    await common.changeLanguage('us');
    // 로그인 진행
    await loginPage.login('tester', 'tester');
    // Monitoring 페이지 진입
    await menuPage.navigateTo('monitoring');
    // communication state 값 영역
    const stateValueBox = page.locator('.state-row').first().locator('.state-value');
    // Not communicating 및 배경까지 이미지 비교
    await expect(stateValueBox).toHaveScreenshot('not_communicating-state.png');
});
